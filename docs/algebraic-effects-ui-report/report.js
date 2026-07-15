(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = (duration = 220) => new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 12 : duration));

  function setText(selector, value, root = document) {
    const element = $(selector, root);
    if (element) element.textContent = String(value);
  }

  function setButtonsDisabled(buttons, disabled) {
    buttons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  // -----------------------------------------------------------------------
  // Reading progress, current section, and mobile table of contents
  // -----------------------------------------------------------------------

  const progress = $("#reading-progress");
  const toc = $("#toc");
  const tocToggle = $("#toc-toggle");
  const tocLinks = $$(".toc a");
  const sections = $$(".report-section");

  function updateReadingProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.width = `${ratio * 100}%`;
  }

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  updateReadingProgress();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (!visible) return;
        tocLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-18% 0px -68%", threshold: [0, 0.12, 0.35] },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  tocToggle.addEventListener("click", () => {
    const open = toc.classList.toggle("is-open");
    tocToggle.setAttribute("aria-expanded", String(open));
  });

  tocLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toc.classList.remove("is-open");
      tocToggle.setAttribute("aria-expanded", "false");
    });
  });

  // -----------------------------------------------------------------------
  // Live dependency graph
  // -----------------------------------------------------------------------

  const flow = {
    count: 2,
    cycle: 0,
    running: false,
    edges: [],
  };
  const flowStage = $("#flow-graph");
  const flowButtons = [$("#flow-plus"), $("#flow-batch"), $("#flow-reset")];

  const flowConnections = [
    ["node-count", "node-square", "count-square"],
    ["node-count", "node-parity", "count-parity"],
    ["node-count", "node-dom-number", "count-number"],
    ["node-square", "node-dom-square", "square-dom"],
    ["node-parity", "node-dom-theme", "parity-dom"],
  ];

  function drawConnection(fromId, toId, name) {
    const from = $(`#${fromId}`);
    const to = $(`#${toId}`);
    let edge = $(`.graph-edge[data-edge="${name}"]`, flowStage);
    if (!edge) {
      edge = document.createElement("span");
      edge.className = "graph-edge";
      edge.dataset.edge = name;
      edge.setAttribute("aria-hidden", "true");
      flowStage.appendChild(edge);
    }

    const stageRect = flowStage.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const startX = fromRect.left - stageRect.left + fromRect.width;
    const startY = fromRect.top - stageRect.top + fromRect.height / 2;
    const endX = toRect.left - stageRect.left;
    const endY = toRect.top - stageRect.top + toRect.height / 2;
    const distance = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    edge.style.left = `${startX}px`;
    edge.style.top = `${startY}px`;
    edge.style.width = `${distance}px`;
    edge.style.transform = `rotate(${angle}deg)`;
    return edge;
  }

  function redrawFlowGraph() {
    flow.edges = flowConnections.map(([from, to, name]) => ({
      name,
      element: drawConnection(from, to, name),
    }));
  }

  function flowEdge(name) {
    return flow.edges.find((edge) => edge.name === name)?.element;
  }

  function flowNode(name) {
    return $(`[data-node="${name}"]`, flowStage);
  }

  function clearFlowActivity() {
    $$(".is-active", flowStage).forEach((element) => element.classList.remove("is-active"));
  }

  function activateFlow(nodes, edges) {
    clearFlowActivity();
    nodes.forEach((name) => flowNode(name)?.classList.add("is-active"));
    edges.forEach((name) => flowEdge(name)?.classList.add("is-active"));
  }

  function renderFlowValues() {
    setText("#flow-count", flow.count);
    setText("#flow-square", flow.count * flow.count);
    setText("#flow-parity", flow.count % 2 === 0 ? "偶数" : "奇数");
  }

  function renderTrace(items) {
    const trace = $("#flow-trace");
    trace.replaceChildren();
    items.forEach((item, index) => {
      const li = document.createElement("li");
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      li.append(number, document.createTextNode(item));
      trace.appendChild(li);
    });
  }

  async function runFlow(writes, reset = false) {
    if (flow.running) return;
    const next = reset ? 2 : flow.count + writes;
    if (next === flow.count) {
      renderTrace(["新旧值相等，写入处理器直接停止；没有节点需要排队。"]);
      return;
    }

    flow.running = true;
    setButtonsDisabled(flowButtons, true);
    flow.cycle += 1;
    const previous = flow.count;
    const writeCount = reset ? 1 : writes;
    const parityChanged = previous % 2 !== next % 2;
    setText("#flow-cycle", `cycle ${String(flow.cycle).padStart(2, "0")}`);
    setText("#flow-write-count", writeCount);
    setText("#flow-compute-count", 0);
    setText("#flow-dom-count", 0);

    activateFlow(["count"], []);
    flow.count = next;
    setText("#flow-count", flow.count);
    const firstLine = writeCount > 1
      ? `批次内完成 ${writeCount} 次写入（${previous} → ${next}），现在只触发一次刷新。`
      : `count 从 ${previous} 写为 ${next}；直接使用者进入队列。`;
    renderTrace([firstLine]);
    await tick();

    activateFlow(["count", "square", "parity"], ["count-square", "count-parity"]);
    setText("#flow-square", flow.count * flow.count);
    setText("#flow-parity", flow.count % 2 === 0 ? "偶数" : "奇数");
    setText("#flow-compute-count", 2);
    renderTrace([
      firstLine,
      `先重算中间结果：平方得到 ${flow.count * flow.count}，奇偶得到${flow.count % 2 === 0 ? "偶数" : "奇数"}。`,
    ]);
    await tick();

    const domNodes = ["dom-number", "dom-square"];
    const domEdges = ["count-number", "square-dom"];
    if (parityChanged) {
      domNodes.push("dom-theme");
      domEdges.push("parity-dom");
    }
    activateFlow(["count", "square", "parity", ...domNodes], domEdges);
    setText("#flow-dom-count", parityChanged ? 3 : 2);
    renderTrace([
      firstLine,
      `先重算中间结果：平方得到 ${flow.count * flow.count}，奇偶得到${flow.count % 2 === 0 ? "偶数" : "奇数"}。`,
      parityChanged
        ? "页面阶段：更新数字、平方文字和奇偶样式，共 3 个目标。"
        : "奇偶值没有变化；样式分支被截断，只改数字和平方文字。",
      "刷新完成；导航、侧栏和其他 DOM 从未进入这轮工作。",
    ]);
    await tick(320);
    clearFlowActivity();
    flow.running = false;
    setButtonsDisabled(flowButtons, false);
  }

  $("#flow-plus").addEventListener("click", () => runFlow(1));
  $("#flow-batch").addEventListener("click", () => runFlow(3));
  $("#flow-reset").addEventListener("click", () => runFlow(0, true));

  window.addEventListener("resize", redrawFlowGraph, { passive: true });
  window.requestAnimationFrame(redrawFlowGraph);

  // -----------------------------------------------------------------------
  // Scheduler stepper: Stale vs Pending and equality pruning
  // -----------------------------------------------------------------------

  const scheduler = {
    count: 2,
    parity: "偶",
    double: 4,
    steps: [],
    index: -1,
    timer: null,
    auto: false,
  };

  const schedulerNodes = {
    count: $("#diamond-count"),
    parity: $("#diamond-parity"),
    double: $("#diamond-double"),
    summary: $("#diamond-summary"),
  };

  function cleanSnapshot(message = "选择 +1 或 +2，创建一次变化。") {
    return {
      values: { count: scheduler.count, parity: scheduler.parity, double: scheduler.double },
      states: { count: "clean", parity: "clean", double: "clean", summary: "clean" },
      queues: { derive: [], effect: [] },
      message,
      runs: 0,
      pruned: 0,
    };
  }

  function buildSchedulerSteps(delta) {
    const oldCount = scheduler.count;
    const nextCount = oldCount + delta;
    const oldParity = scheduler.parity;
    const nextParity = nextCount % 2 === 0 ? "偶" : "奇";
    const nextDouble = nextCount * 2;
    const paritySame = oldParity === nextParity;

    return [
      {
        values: { count: nextCount, parity: oldParity, double: scheduler.double },
        states: { count: "running", parity: "clean", double: "clean", summary: "clean" },
        queues: { derive: [], effect: [] },
        message: `写入立即把 count 从 ${oldCount} 改为 ${nextCount}，接下来通知直接使用者。`,
        runs: 0,
        pruned: 0,
      },
      {
        values: { count: nextCount, parity: oldParity, double: scheduler.double },
        states: { count: "clean", parity: "stale", double: "stale", summary: "pending" },
        queues: { derive: ["奇偶", "两倍"], effect: ["汇总 UI（待确认）"] },
        message: "奇偶和两倍直接读了 count，所以确定过期；汇总 UI 只知道它的上游可能变化，先标为待确认。",
        runs: 0,
        pruned: 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: scheduler.double },
        states: {
          count: "clean",
          parity: paritySame ? "pruned" : "clean",
          double: "stale",
          summary: paritySame ? "pending" : "stale",
        },
        queues: { derive: ["两倍"], effect: [paritySame ? "汇总 UI（仍待确认）" : "汇总 UI"] },
        message: paritySame
          ? `奇偶重算后仍是“${nextParity}”。结果相等，这一条变化在这里停止，汇总 UI 暂时不用因此运行。`
          : `奇偶从“${oldParity}”变成“${nextParity}”。汇总 UI 现在确定过期，但仍要等其他中间结果。`,
        runs: 1,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "clean", parity: "clean", double: "clean", summary: "stale" },
        queues: { derive: [], effect: ["汇总 UI"] },
        message: `两倍从 ${scheduler.double} 变成 ${nextDouble}。中间结果队列已经清空，现在才轮到页面动作。`,
        runs: 2,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "clean", parity: "clean", double: "clean", summary: "running" },
        queues: { derive: [], effect: [] },
        message: `汇总 UI 一次读到同一版本的数据：count=${nextCount}、奇偶=${nextParity}、两倍=${nextDouble}。`,
        runs: 3,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "clean", parity: "clean", double: "clean", summary: "clean" },
        queues: { derive: [], effect: [] },
        message: paritySame
          ? "刷新完成。相等判断截断了一条无效变化，同时另一条真实变化仍正确抵达页面。"
          : "刷新完成。所有中间结果先稳定，页面动作最后运行一次。",
        runs: 3,
        pruned: paritySame ? 1 : 0,
        commit: { count: nextCount, parity: nextParity, double: nextDouble },
      },
    ];
  }

  const stateLabels = {
    clean: "干净",
    pending: "待确认",
    stale: "确定过期",
    running: "正在处理",
    pruned: "相等，已截断",
  };

  function renderQueue(selector, items) {
    const list = $(selector);
    list.replaceChildren();
    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "空";
      list.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function renderSchedulerStep(step) {
    Object.entries(schedulerNodes).forEach(([name, node]) => {
      const state = step.states[name];
      node.className = `diamond-node is-${state}`;
      $("em", node).textContent = stateLabels[state];
    });
    $("#diamond-count strong span").textContent = step.values.count;
    $("#diamond-parity strong span").textContent = step.values.parity;
    $("#diamond-double strong span").textContent = step.values.double;
    setText("#scheduler-message", step.message);
    setText("#scheduler-progress", scheduler.steps.length ? `${scheduler.index + 1} / ${scheduler.steps.length}` : "0 / 0");
    setText("#scheduler-runs", step.runs);
    setText("#scheduler-pruned", step.pruned);
    renderQueue("#derive-queue", step.queues.derive);
    renderQueue("#effect-queue", step.queues.effect);
  }

  function stopSchedulerAuto() {
    if (scheduler.timer) window.clearTimeout(scheduler.timer);
    scheduler.timer = null;
    scheduler.auto = false;
    $("#scheduler-auto").classList.remove("is-active");
    $("#scheduler-auto").setAttribute("aria-pressed", "false");
    $("#scheduler-auto").textContent = "自动播放";
  }

  function schedulerNext() {
    if (scheduler.steps.length === 0) return;
    if (scheduler.index >= scheduler.steps.length - 1) {
      stopSchedulerAuto();
      return;
    }
    scheduler.index += 1;
    const step = scheduler.steps[scheduler.index];
    renderSchedulerStep(step);
    if (step.commit) {
      scheduler.count = step.commit.count;
      scheduler.parity = step.commit.parity;
      scheduler.double = step.commit.double;
    }
    if (scheduler.auto) scheduler.timer = window.setTimeout(schedulerNext, reducedMotion ? 90 : 900);
  }

  function startSchedulerScenario(delta) {
    stopSchedulerAuto();
    scheduler.steps = buildSchedulerSteps(delta);
    scheduler.index = -1;
    schedulerNext();
  }

  $("#scheduler-plus-one").addEventListener("click", () => startSchedulerScenario(1));
  $("#scheduler-plus-two").addEventListener("click", () => startSchedulerScenario(2));
  $("#scheduler-step").addEventListener("click", schedulerNext);
  $("#scheduler-auto").addEventListener("click", () => {
    if (scheduler.auto) {
      stopSchedulerAuto();
      return;
    }
    if (scheduler.steps.length === 0 || scheduler.index >= scheduler.steps.length - 1) {
      scheduler.steps = buildSchedulerSteps(2);
      scheduler.index = -1;
    }
    scheduler.auto = true;
    $("#scheduler-auto").classList.add("is-active");
    $("#scheduler-auto").setAttribute("aria-pressed", "true");
    $("#scheduler-auto").textContent = "暂停";
    schedulerNext();
  });
  $("#scheduler-reset").addEventListener("click", () => {
    stopSchedulerAuto();
    scheduler.count = 2;
    scheduler.parity = "偶";
    scheduler.double = 4;
    scheduler.steps = [];
    scheduler.index = -1;
    renderSchedulerStep(cleanSnapshot());
  });

  // -----------------------------------------------------------------------
  // Batch comparison
  // -----------------------------------------------------------------------

  const batchButtons = $$("[data-writes]", $("#batch-lab"));

  function createTimelineItem(label, className) {
    const li = document.createElement("li");
    li.textContent = label;
    if (className) li.className = className;
    return li;
  }

  function setBar(name, value, maximum) {
    const bar = $(`[data-bar="${name}"]`);
    const label = $(`[data-value="${name}"]`);
    bar.style.width = `${Math.max(8, (value / maximum) * 100)}%`;
    label.textContent = value;
  }

  function renderBatch(writes) {
    batchButtons.forEach((button) => button.classList.toggle("is-active", Number(button.dataset.writes) === writes));
    const naive = { write: writes, compute: writes * 2, dom: writes * 3 };
    const batched = { write: writes, compute: 2, dom: 3 };
    setBar("naive-write", naive.write, naive.write);
    setBar("batch-write", batched.write, naive.write);
    setBar("naive-compute", naive.compute, naive.compute);
    setBar("batch-compute", batched.compute, naive.compute);
    setBar("naive-dom", naive.dom, naive.dom);
    setBar("batch-dom", batched.dom, naive.dom);

    const naiveTimeline = $("#naive-timeline");
    const batchTimeline = $("#batch-timeline");
    naiveTimeline.replaceChildren();
    batchTimeline.replaceChildren();
    for (let index = 0; index < writes; index += 1) {
      naiveTimeline.append(
        createTimelineItem("写"),
        createTimelineItem("算"),
        createTimelineItem("DOM"),
      );
      batchTimeline.append(createTimelineItem("写"));
    }
    batchTimeline.append(createTimelineItem("算"), createTimelineItem("DOM"));

    setText(
      "#batch-result",
      writes === 1
        ? "写 1 次时，两种方式工作量相同。"
        : `写 ${writes} 次时，batch 仍只安排 2 个中间计算和 3 个页面动作；示意工作量从 ${naive.compute + naive.dom} 降到 ${batched.compute + batched.dom}。`,
    );
  }

  batchButtons.forEach((button) => button.addEventListener("click", () => renderBatch(Number(button.dataset.writes))));
  renderBatch(1);

  // -----------------------------------------------------------------------
  // Dynamic dependencies
  // -----------------------------------------------------------------------

  const dynamic = {
    mode: "name",
    renders: 1,
  };
  const modeName = $("#mode-name");
  const modeCount = $("#mode-count");
  const dynamicName = $("#dynamic-name");
  const dynamicCount = $("#dynamic-count");

  function currentDynamicOutput() {
    return dynamic.mode === "name"
      ? `访客 ${dynamicName.value || "—"}`
      : `第 ${dynamicCount.value || "0"} 次访问`;
  }

  function renderDynamic(reason, didRun = true) {
    if (didRun) dynamic.renders += 1;
    setText("#dynamic-output", currentDynamicOutput());
    setText("#dynamic-render-count", `页面动作运行 ${dynamic.renders} 次`);
    modeName.classList.toggle("is-active", dynamic.mode === "name");
    modeCount.classList.toggle("is-active", dynamic.mode === "count");
    $("#dynamic-name-node").classList.toggle("is-muted", dynamic.mode !== "name");
    $("#dynamic-count-node").classList.toggle("is-muted", dynamic.mode !== "count");
    $("#dynamic-name-edge").classList.toggle("is-hidden", dynamic.mode !== "name");
    $("#dynamic-count-edge").classList.toggle("is-hidden", dynamic.mode !== "count");
    setText("#dynamic-log span", reason);
  }

  function switchDynamicMode(mode) {
    if (mode === dynamic.mode) return;
    const oldDependency = dynamic.mode === "name" ? "name" : "count";
    const newDependency = mode === "name" ? "name" : "count";
    dynamic.mode = mode;
    renderDynamic(`重新运行后移除旧边 ${oldDependency} → 标题，建立新边 ${newDependency} → 标题。`);
  }

  modeName.addEventListener("click", () => switchDynamicMode("name"));
  modeCount.addEventListener("click", () => switchDynamicMode("count"));
  dynamicName.addEventListener("input", () => {
    renderDynamic(
      dynamic.mode === "name" ? "name 是当前依赖：标题页面动作已运行。" : "name 不是当前依赖：值变了，但标题没有运行。",
      dynamic.mode === "name",
    );
  });
  dynamicCount.addEventListener("input", () => {
    renderDynamic(
      dynamic.mode === "count" ? "count 是当前依赖：标题页面动作已运行。" : "count 不是当前依赖：值变了，但标题没有运行。",
      dynamic.mode === "count",
    );
  });

  // -----------------------------------------------------------------------
  // Ownership and cleanup
  // -----------------------------------------------------------------------

  const ownership = {
    mounted: true,
    branch: "A",
    busy: false,
    cleanups: 0,
  };
  const ownershipButtons = [$("#ownership-toggle"), $("#ownership-unmount"), $("#ownership-reset")];

  function ownerNodes(names) {
    return names.map((name) => $(`[data-owner="${name}"]`)).filter(Boolean);
  }

  function writeCleanupLog(lines) {
    const list = $("#cleanup-log");
    list.replaceChildren();
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      list.appendChild(li);
    });
    setText("#cleanup-count", `${ownership.cleanups} 项`);
  }

  async function runOwnership(kind) {
    if (ownership.busy) return;
    if (kind === "toggle" && !ownership.mounted) {
      writeCleanupLog(["卡片已经卸载；先点击“重新挂载”。"]);
      return;
    }
    if (kind === "unmount" && !ownership.mounted) {
      writeCleanupLog(["根已经卸载；重复 dispose 是安全的，不再做任何工作。"]);
      return;
    }

    ownership.busy = true;
    setButtonsDisabled(ownershipButtons, true);
    const targets = kind === "toggle"
      ? ownerNodes(["detail"])
      : kind === "unmount"
        ? ownerNodes(["root", "card", "text", "detail", "listener"])
        : ownerNodes(["root", "card", "text", "detail", "listener"]);

    if (kind === "reset") {
      targets.forEach((node) => {
        node.classList.remove("is-disposed", "is-disposing");
        node.classList.add("is-new");
      });
      ownership.mounted = true;
      ownership.branch = "A";
      setText("#owner-detail-label", "详情 A");
      writeCleanupLog(["创建新的所有权树。", "文字绑定、详情区域与点击监听重新挂到资料卡下。"]);
      await tick(360);
      targets.forEach((node) => node.classList.remove("is-new"));
      ownership.busy = false;
      setButtonsDisabled(ownershipButtons, false);
      return;
    }

    targets.forEach((node) => node.classList.add("is-disposing"));
    writeCleanupLog([
      `阶段 1：先把${kind === "toggle" ? "旧详情分支" : "整棵卡片树"}标为已销毁。`,
      "从刷新队列移除，并断开所有数据依赖。",
    ]);
    await tick(420);
    targets.forEach((node) => {
      node.classList.remove("is-disposing");
      node.classList.add("is-disposed");
    });

    if (kind === "toggle") {
      ownership.cleanups += 1;
      writeCleanupLog([
        "阶段 1：旧详情已封锁并断开依赖。",
        "阶段 2：移除旧详情的 DOM 范围。",
        `cleanup #${ownership.cleanups} 完成，准备创建新分支。`,
      ]);
      await tick(300);
      ownership.branch = ownership.branch === "A" ? "B" : "A";
      const detail = $("[data-owner=\"detail\"]");
      detail.classList.remove("is-disposed");
      detail.classList.add("is-new");
      setText("#owner-detail-label", `详情 ${ownership.branch}`);
      writeCleanupLog([
        "旧分支已经完整移除。",
        `详情 ${ownership.branch} 成为资料卡的新孩子。`,
        "新分支读取数据并建立自己的依赖。",
      ]);
      await tick(360);
      detail.classList.remove("is-new");
    } else {
      ownership.cleanups += 3;
      ownership.mounted = false;
      writeCleanupLog([
        "阶段 1：所有后代已封锁并断开依赖。",
        "阶段 2：移除点击监听。",
        "阶段 2：清理文字绑定与条件区域。",
        "阶段 2：移除挂载 DOM 范围。",
      ]);
    }

    ownership.busy = false;
    setButtonsDisabled(ownershipButtons, false);
  }

  $("#ownership-toggle").addEventListener("click", () => runOwnership("toggle"));
  $("#ownership-unmount").addEventListener("click", () => runOwnership("unmount"));
  $("#ownership-reset").addEventListener("click", () => runOwnership("reset"));

  // -----------------------------------------------------------------------
  // Framework route comparison
  // -----------------------------------------------------------------------

  const comparisonScenarios = {
    leaf: {
      react: {
        route: ["state 更新", "调用组件", "比较结果", "提交文字 DOM"],
        note: "默认从发生更新的组件开始重新计算其返回结果，再把必要的 DOM 改动提交出去。",
        work: 64,
        scope: "组件子树",
      },
      vue: {
        route: ["属性写入", "触发订阅", "组件更新", "补丁文字 DOM"],
        note: "Proxy / ref 在运行时跟踪读写；组件本身以响应式 effect 进行渲染和更新。",
        work: 48,
        scope: "相关组件",
      },
      solid: {
        route: ["signal 写入", "通知使用者", "重算绑定", "改文字节点"],
        note: "运行时记录 signal 与计算之间的联系，静态 DOM 通常只建立一次。",
        work: 22,
        scope: "绑定节点",
      },
      kokaine: {
        route: ["write 操作", "处理器排队", "先结果后页面", "改文字节点"],
        note: "数据路线接近 Solid；读写额外经过可组合的 Koka 效应处理器。",
        work: 22,
        scope: "绑定节点",
      },
    },
    branch: {
      react: {
        route: ["state 更新", "重新得到分支描述", "协调子树", "提交增删"],
        note: "组件重新返回新的元素结构，React 协调前后结构并提交必要的节点增删。",
        work: 78,
        scope: "条件子树",
      },
      vue: {
        route: ["条件写入", "组件更新", "执行分支补丁", "挂载 / 卸载"],
        note: "编译器为模板生成分支提示，运行时组件 effect 执行对应的补丁路径。",
        work: 58,
        scope: "条件区块",
      },
      solid: {
        route: ["signal 写入", "条件计算", "清理旧 owner", "挂载新分支"],
        note: "控制流原语拥有自己的响应式范围，切换时清理旧分支并建立新分支。",
        work: 37,
        scope: "条件区域",
      },
      kokaine: {
        route: ["write 操作", "region 过期", "封锁并清理旧树", "挂载新分支"],
        note: "region effect 拥有分支内绑定和监听器；重跑前先按所有权树清理旧资源。",
        work: 39,
        scope: "所有权区域",
      },
    },
    batch: {
      react: {
        route: ["3 次 state 更新", "自动批处理", "组件渲染", "一次提交"],
        note: "现代 React 会在常见事件中批处理更新；最终渲染与提交次数取决于边界和更新方式。",
        work: 54,
        scope: "批后的子树",
      },
      vue: {
        route: ["3 次属性写入", "任务去重", "组件更新", "一次补丁"],
        note: "响应式触发被调度到队列，同一组件的更新任务会被合并。",
        work: 45,
        scope: "去重任务",
      },
      solid: {
        route: ["batch 中 3 次写", "延后下游", "一次传播", "目标 DOM"],
        note: "batch 延后下游计算，离开批次后按最终值更新依赖。",
        work: 20,
        scope: "最终依赖",
      },
      kokaine: {
        route: ["handler 记录批次深度", "3 次写只排队", "先 memo 后 effect", "目标 DOM"],
        note: "enter-batch / leave-batch 是写入效应操作，最外层离开时才真正 flush。",
        work: 20,
        scope: "最终依赖",
      },
    },
  };

  const scenarioButtons = $$("[data-scenario]", $("#comparison"));

  function renderComparison(scenario) {
    scenarioButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.scenario === scenario));
    Object.entries(comparisonScenarios[scenario]).forEach(([framework, details]) => {
      const card = $(`[data-framework="${framework}"]`);
      const route = $("[data-route]", card);
      route.replaceChildren();
      details.route.forEach((item, index) => {
        const span = document.createElement("span");
        span.textContent = item;
        route.appendChild(span);
        if (index < details.route.length - 1) {
          const arrow = document.createElement("i");
          arrow.textContent = "→";
          route.appendChild(arrow);
        }
      });
      $("[data-route-note]", card).textContent = details.note;
      $("[data-work]", card).style.width = `${details.work}%`;
      $(".work-meter em", card).textContent = details.scope;
    });
  }

  scenarioButtons.forEach((button) => button.addEventListener("click", () => renderComparison(button.dataset.scenario)));

  // -----------------------------------------------------------------------
  // Accessible code tabs and real demo reload
  // -----------------------------------------------------------------------

  const tabList = $(".code-tabs__list");
  const tabs = $$('[role="tab"]', tabList);

  function activateTab(tab) {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = $(`#${candidate.getAttribute("aria-controls")}`);
      panel.hidden = !selected;
    });
    tab.focus();
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));
  tabList.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = tabs.indexOf(document.activeElement);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    activateTab(tabs[next]);
  });

  $("#demo-reload").addEventListener("click", () => {
    const frame = $("#koka-demo");
    frame.src = frame.getAttribute("src");
  });

  window.addEventListener("load", redrawFlowGraph, { once: true });
})();

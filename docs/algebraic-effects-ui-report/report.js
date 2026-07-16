(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = (duration = 220) => new Promise((resolve) => {
    window.setTimeout(resolve, reducedMotion ? 12 : duration);
  });

  function setText(selector, value, root = document) {
    const element = $(selector, root);
    if (element) element.textContent = String(value);
  }

  function setButtonsDisabled(buttons, disabled) {
    buttons.filter(Boolean).forEach((button) => {
      button.disabled = disabled;
    });
  }

  // Reading progress, current section, and mobile table of contents.
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

  // Semantic simulation: source-local capture index and exact suffix work.
  const flow = { count: 2, version: 0, cycle: 0, running: false, links: [] };
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
    edge.style.left = `${startX}px`;
    edge.style.top = `${startY}px`;
    edge.style.width = `${Math.hypot(endX - startX, endY - startY)}px`;
    edge.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg)`;
    return edge;
  }

  function redrawFlowTrace() {
    flow.links = flowConnections.map(([from, to, name]) => ({
      name,
      element: drawConnection(from, to, name),
    }));
  }

  function clearFlowActivity() {
    $$(".is-active", flowStage).forEach((element) => element.classList.remove("is-active"));
  }

  function activateFlow(nodes, links) {
    clearFlowActivity();
    nodes.forEach((name) => $(`[data-node="${name}"]`, flowStage)?.classList.add("is-active"));
    links.forEach((name) => flow.links.find((link) => link.name === name)?.element.classList.add("is-active"));
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
      renderTrace(["新旧值相等：write handler 不提交 cell、不增加 version，也不 notify source-local captures。"]);
      return;
    }

    flow.running = true;
    setButtonsDisabled(flowButtons, true);
    flow.cycle += 1;
    const previous = flow.count;
    const writeCount = reset ? 1 : writes;
    const parityChanged = previous % 2 !== next % 2;
    flow.count = next;
    flow.version += writeCount;
    setText("#flow-cycle", `cycle ${String(flow.cycle).padStart(2, "0")}`);
    setText("#flow-write-count", writeCount);
    setText("#flow-compute-count", 0);
    setText("#flow-dom-count", 0);
    setText("#flow-count", flow.count);

    const firstLine = writeCount > 1
      ? `batch 内逐次提交 ${writeCount} 次 cell/version/notify（${previous} → ${next}，模拟 version=${flow.version}）；第一次 notify 已把 Live captures 变为 Pending，后续 notify 不复制同一 resumption。`
      : `count 从 ${previous} 提交为 ${next}（模拟 version=${flow.version}）；source-local index 把对应 Live captures 转为 Pending，并排入 Resume-work(trace)。`;
    activateFlow(["count"], []);
    renderTrace([firstLine]);
    await tick();

    const deriveLine = `pure plane 先恢复 square 与 parity 的精确 suffix；每次恢复都在 Draft frame 中捕获新的 child trace，prefix 不重放。`;
    activateFlow(["count", "square", "parity"], ["count-square", "count-parity"]);
    setText("#flow-square", flow.count * flow.count);
    setText("#flow-parity", flow.count % 2 === 0 ? "偶数" : "奇数");
    setText("#flow-compute-count", 2);
    renderTrace([firstLine, deriveLine]);
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
      deriveLine,
      parityChanged
        ? "square 与 parity 都发布不相等结果；输出 source notify 对应 effect-plane captures。"
        : "parity 的 equality 截断 publication：它的输出 version 不变，也不唤醒 parity 后面的 UI suffix。",
      `effect plane 恢复此固定教学场景中的 ${parityChanged ? 3 : 2} 段 UI suffix；这些数字是模拟结果，不是框架对任意应用的固定保证。`,
    ]);
    await tick(320);
    clearFlowActivity();
    flow.running = false;
    setButtonsDisabled(flowButtons, false);
  }

  $("#flow-plus").addEventListener("click", () => runFlow(1));
  $("#flow-batch").addEventListener("click", () => runFlow(3));
  $("#flow-reset").addEventListener("click", () => runFlow(0, true));
  window.addEventListener("resize", redrawFlowTrace, { passive: true });
  window.requestAnimationFrame(redrawFlowTrace);

  // Semantic simulation: frontier, nested effect captures, and stale tickets.
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

  function liveSnapshot(message = "选择 +1 或 +2，创建一次变化。") {
    return {
      values: { count: scheduler.count, parity: scheduler.parity, double: scheduler.double },
      states: { count: "source", parity: "live", double: "live", summary: "live" },
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
    const oldDouble = scheduler.double;
    const nextDouble = nextCount * 2;
    const paritySame = oldParity === nextParity;
    const parityEffect = paritySame ? [] : ["Resume(summary@parity)"];
    const bothEffectTickets = paritySame
      ? ["Resume(summary@double)"]
      : ["Resume(summary@double · deferred)", "Resume(summary@parity)"];

    return [
      {
        values: { count: nextCount, parity: oldParity, double: oldDouble },
        states: { count: "source", parity: "pending", double: "pending", summary: "live" },
        queues: { derive: ["Resume(parity K)", "Resume(double K)"], effect: [] },
        message: `count ${oldCount} → ${nextCount}：两个 pure captures 从 Live 变 Pending；队列保存 trace，不保存 producer action。`,
        runs: 0,
        pruned: 0,
      },
      {
        values: { count: nextCount, parity: oldParity, double: oldDouble },
        states: { count: "source", parity: "running", double: "pending", summary: "live" },
        queues: { derive: ["Resume(double K)"], effect: [] },
        message: "frontier 选中没有 Pending/Running ancestor 的 parity K：capability 进入 Running，新后缀与结构孩子先进入 Draft frame。",
        runs: 1,
        pruned: 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: oldDouble },
        states: { count: "source", parity: "live", double: "pending", summary: paritySame ? "live" : "pending" },
        queues: { derive: ["Resume(double K)"], effect: parityEffect },
        message: paritySame
          ? `parity 仍为“${nextParity}”：Draft trace 可转 Live，但 output source equality 截断发布，不产生 effect ticket。`
          : `parity 发布“${nextParity}”：summary@parity capture 进入 Pending。它的 K 包含后续 double.get，因此是 UI trace 的外层 capture。`,
        runs: 1,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "source", parity: "live", double: "live", summary: "pending" },
        queues: { derive: [], effect: bothEffectTickets },
        message: paritySame
          ? `double 发布 ${nextDouble}，只让更窄的 summary@double suffix 进入 Pending；恢复它无需重读 parity。`
          : `double 发布 ${nextDouble}，旧 summary@double child 也有一张 ticket，但它位于 Pending 外层 capture 下，frontier 暂时 deferred。`,
        runs: 2,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "source", parity: "live", double: "live", summary: "running" },
        queues: {
          derive: [],
          effect: paritySame ? [] : ["stale: summary@double-old"],
        },
        message: paritySame
          ? "frontier 直接恢复 summary@double K：只执行 double.get 后的 UI suffix；更早的 parity read 不重放。"
          : "frontier 先恢复外层 summary@parity K，重新执行后续 double.get 并建立新 child；旧 child 变 Dead，旧 ticket 随即 stale。",
        runs: 3,
        pruned: paritySame ? 1 : 0,
      },
      {
        values: { count: nextCount, parity: nextParity, double: nextDouble },
        states: { count: "source", parity: "live", double: "live", summary: "live" },
        queues: { derive: [], effect: [] },
        message: paritySame
          ? "新 UI suffix 发布成功并转 Live；effect plane 回到 frontier。"
          : "取工作时丢弃 Dead capture 对应的 stale ticket；没有 Observer 去重 latch，只有嵌套 K、ancestor frontier 与 capability state。",
        runs: 3,
        pruned: paritySame ? 1 : 0,
        commit: { count: nextCount, parity: nextParity, double: nextDouble },
      },
    ];
  }

  const stateLabels = {
    source: "cell / version",
    draft: "Draft",
    live: "Live",
    pending: "Pending",
    running: "Running",
    dead: "Dead",
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
    setText("#diamond-count strong span", step.values.count);
    setText("#diamond-parity strong span", step.values.parity);
    setText("#diamond-double strong span", step.values.double);
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
    if (scheduler.steps.length === 0 || scheduler.index >= scheduler.steps.length - 1) {
      stopSchedulerAuto();
      return;
    }
    scheduler.index += 1;
    const step = scheduler.steps[scheduler.index];
    renderSchedulerStep(step);
    if (step.commit) Object.assign(scheduler, step.commit);
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
    Object.assign(scheduler, { count: 2, parity: "偶", double: 4, steps: [], index: -1 });
    renderSchedulerStep(liveSnapshot());
  });

  // Batch comparison. Counts belong only to this fixed semantic scenario.
  const batchButtons = $$("[data-writes]", $("#batch-lab"));

  function createTimelineItem(label) {
    const li = document.createElement("li");
    li.textContent = label;
    return li;
  }

  function setBar(name, value, maximum) {
    $(`[data-bar="${name}"]`).style.width = `${Math.max(8, (value / maximum) * 100)}%`;
    $(`[data-value="${name}"]`).textContent = value;
  }

  function renderBatch(writes) {
    batchButtons.forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.writes) === writes);
    });
    const immediate = { write: writes, compute: writes * 2, dom: writes * 3 };
    const batched = { write: writes, compute: 2, dom: 3 };
    setBar("naive-write", immediate.write, immediate.write);
    setBar("batch-write", batched.write, immediate.write);
    setBar("naive-compute", immediate.compute, immediate.compute);
    setBar("batch-compute", batched.compute, immediate.compute);
    setBar("naive-dom", immediate.dom, immediate.dom);
    setBar("batch-dom", batched.dom, immediate.dom);

    const immediateTimeline = $("#naive-timeline");
    const batchTimeline = $("#batch-timeline");
    immediateTimeline.replaceChildren();
    batchTimeline.replaceChildren();
    for (let index = 0; index < writes; index += 1) {
      immediateTimeline.append(createTimelineItem("写/notify"), createTimelineItem("settle"), createTimelineItem("publish"));
      batchTimeline.append(createTimelineItem("写/notify"));
    }
    batchTimeline.append(createTimelineItem("settle"), createTimelineItem("publish"));
    setText(
      "#batch-result",
      writes === 1
        ? "在这条固定模拟路径中，写 1 次时两边相同。"
        : `在这条固定模拟路径中，${writes} 次 write/version/notify 都发生；batch 只把 settling 延后到最外层边界。图中恢复与 DOM 数不是通用性能保证。`,
    );
  }

  batchButtons.forEach((button) => {
    button.addEventListener("click", () => renderBatch(Number(button.dataset.writes)));
  });
  renderBatch(1);

  // Dynamic nested trace simulation.
  const dynamic = { mode: "name", renders: 1 };
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
    setText("#dynamic-render-count", `页面 suffix 运行 ${dynamic.renders} 次`);
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
    const oldSource = dynamic.mode;
    dynamic.mode = mode;
    renderDynamic(`恢复外层 Trace-read(mode) 的 K；旧 ${oldSource} child 变 Dead，新 Draft 捕获 Trace-read(${mode})，发布后整条 trace 转 Live。`);
  }

  modeName.addEventListener("click", () => switchDynamicMode("name"));
  modeCount.addEventListener("click", () => switchDynamicMode("count"));
  dynamicName.addEventListener("input", () => {
    renderDynamic(
      dynamic.mode === "name"
        ? "name 的窄 suffix 被恢复；更早的 mode.get 不重放。"
        : "name 没有属于当前 Live generation 的 capture；值改变但页面 suffix 不运行。",
      dynamic.mode === "name",
    );
  });
  dynamicCount.addEventListener("input", () => {
    renderDynamic(
      dynamic.mode === "count"
        ? "count 的窄 suffix 被恢复；更早的 mode.get 不重放。"
        : "count 没有属于当前 Live generation 的 capture；值改变但页面 suffix 不运行。",
      dynamic.mode === "count",
    );
  });

  // Structural ownership and draft publication simulation.
  const ownership = { mounted: true, branch: "A", busy: false, cleanups: 0 };
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
      writeCleanupLog(["scope 已经 Dead；重复 disposer 不再做结构工作。"]);
      return;
    }
    ownership.busy = true;
    setButtonsDisabled(ownershipButtons, true);
    const allNames = ["root", "card", "text", "detail", "listener"];
    const targets = kind === "toggle" ? ownerNodes(["detail"]) : ownerNodes(allNames);

    if (kind === "reset") {
      targets.forEach((node) => {
        node.classList.remove("is-disposed", "is-disposing");
        node.classList.add("is-new");
      });
      ownership.mounted = true;
      ownership.branch = "A";
      setText("#owner-detail-label", "详情 A");
      writeCleanupLog(["新的 mount bootstrap scope 启动。", "bootstrap closure 只消费一次；成功后 trace 与 frame 变 Live。"]);
      await tick(360);
      targets.forEach((node) => node.classList.remove("is-new"));
      ownership.busy = false;
      setButtonsDisabled(ownershipButtons, false);
      return;
    }

    targets.forEach((node) => node.classList.add("is-disposing"));
    writeCleanupLog([
      kind === "toggle" ? "replacement K 进入 Running，并建立新 Draft branch。" : "disposer 先把完整结构子树标记为 Dead。",
      "旧 capture 不再 runnable；队列中的旧票据由 frontier 视为 stale。",
    ]);
    await tick(420);
    targets.forEach((node) => {
      node.classList.remove("is-disposing");
      node.classList.add("is-disposed");
    });

    if (kind === "toggle") {
      ownership.cleanups += 1;
      writeCleanupLog([
        "旧 generation 的 DOM range、listener 与 child effects 已 finalise。",
        `cleanup #${ownership.cleanups} 完成；新 Draft 尚未对 source 可见。`,
        "计算与 publication 成功后，Draft 才变 Live。",
      ]);
      await tick(300);
      ownership.branch = ownership.branch === "A" ? "B" : "A";
      const detail = $("[data-owner=\"detail\"]");
      detail.classList.remove("is-disposed");
      detail.classList.add("is-new");
      setText("#owner-detail-label", `详情 ${ownership.branch}`);
      writeCleanupLog([
        `详情 ${ownership.branch} 已发布为新的 Live branch。`,
        "若 replacement 计算、cleanup、publish 或 final control 中止，Draft 会被清理，原 K 保持 Pending 等待重试。",
      ]);
      await tick(360);
      detail.classList.remove("is-new");
    } else {
      ownership.cleanups += 3;
      ownership.mounted = false;
      writeCleanupLog([
        "所有 continuation gates 与 frames 已变 Dead。",
        "事件 listener、live text effect 与 region range 按结构 ledger 清理。",
        "source-local capture index 会压缩掉 Dead entries。",
      ]);
    }
    ownership.busy = false;
    setButtonsDisabled(ownershipButtons, false);
  }

  $("#ownership-toggle").addEventListener("click", () => runOwnership("toggle"));
  $("#ownership-unmount").addEventListener("click", () => runOwnership("unmount"));
  $("#ownership-reset").addEventListener("click", () => runOwnership("reset"));

  // Framework route comparison. Work widths are explanatory, not benchmarks.
  const comparisonScenarios = {
    leaf: {
      react: { route: ["state 更新", "调用组件", "比较结果", "提交文字 DOM"], note: "默认从发生更新的组件开始重新计算其返回结果，再提交必要的 DOM 改动。", work: 64, scope: "组件子树" },
      vue: { route: ["属性写入", "触发订阅", "组件更新", "补丁文字 DOM"], note: "Proxy / ref 在运行时跟踪读写；组件通常以响应式 effect 更新。", work: 48, scope: "相关组件" },
      solid: { route: ["signal 写入", "通知计算", "重算绑定", "改文字节点"], note: "运行时记录 signal 与计算之间的联系，静态 DOM 通常只建立一次。", work: 22, scope: "绑定节点" },
      kokaine: { route: ["write operation", "Resume-work(trace)", "恢复 exact suffix", "发布文字 effect"], note: "source 索引实际 K；恢复 tracked read 后缀，而不是从 retained action 开头重算。", work: 22, scope: "capture suffix" },
    },
    branch: {
      react: { route: ["state 更新", "重新得到分支描述", "协调子树", "提交增删"], note: "组件返回新元素结构，React 协调前后结构并提交节点增删。", work: 78, scope: "条件子树" },
      vue: { route: ["条件写入", "组件更新", "执行分支补丁", "挂载 / 卸载"], note: "编译器为模板生成分支提示，运行时执行对应补丁路径。", work: 58, scope: "条件区块" },
      solid: { route: ["signal 写入", "条件计算", "清理旧 owner", "挂载新分支"], note: "控制流范围在切换时清理旧分支并建立新分支。", work: 37, scope: "条件区域" },
      kokaine: { route: ["outer K Pending", "旧 child Dead", "新 child Draft", "publish Live branch"], note: "dynamic 生成的 Region binding，其 continuation frame 拥有该 generation 的 DOM range、listener 与 child effects。", work: 39, scope: "continuation frame" },
    },
    batch: {
      react: { route: ["3 次 state 更新", "自动批处理", "组件渲染", "一次提交"], note: "现代 React 会在常见边界批处理；实际次数依更新方式而定。", work: 54, scope: "批后的子树" },
      vue: { route: ["3 次属性写入", "任务去重", "组件更新", "一次补丁"], note: "触发被调度到队列，同一组件任务通常会合并。", work: 45, scope: "去重任务" },
      solid: { route: ["batch 中 3 次写", "延后下游", "一次传播", "目标 DOM"], note: "batch 延后下游计算，离开边界后按最终值传播。", work: 20, scope: "最终联系" },
      kokaine: { route: ["3 次 write/version/notify", "capability 保持 Pending", "边界后 settle", "publish"], note: "batch 只延迟 settling；source 写入和 notify 仍逐次发生。", work: 20, scope: "Pending frontier" },
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

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => renderComparison(button.dataset.scenario));
  });

  // Accessible code tabs and real example reload.
  const tabList = $(".code-tabs__list");
  const tabs = $$('[role="tab"]', tabList);
  tabs.forEach((tab, index) => { tab.tabIndex = index === 0 ? 0 : -1; });

  function activateTab(tab) {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      $(`#${candidate.getAttribute("aria-controls")}`).hidden = !selected;
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

  window.addEventListener("load", redrawFlowTrace, { once: true });
})();

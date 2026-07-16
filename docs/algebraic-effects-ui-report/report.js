(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setText(selector, value, root = document) {
    const element = $(selector, root);
    if (element) element.textContent = String(value);
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
    if (scheduler.auto && scheduler.index >= scheduler.steps.length - 1) {
      stopSchedulerAuto();
    } else if (scheduler.auto) {
      scheduler.timer = window.setTimeout(schedulerNext, reducedMotion ? 90 : 900);
    }
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
      const active = Number(button.dataset.writes) === writes;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
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
    scenarioButtons.forEach((button) => {
      const active = button.dataset.scenario === scenario;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
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

})();

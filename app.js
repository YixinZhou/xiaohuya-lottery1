/**
 * 荆州老乡认证 · 多页流程
 * 修改兑换二维码指向：改 COUPON_QR_URL
 */
(function () {
  /** 兑换券二维码内容（改为门店小程序/H5 领券页等） */
  var COUPON_QR_URL = "https://yixinzhou.github.io/xiaohuya-lottery1/index.html";

  /** 每题正确选项索引：A=0, B=1, C=2 */
  var CORRECT = [1, 0, 2, 1, 0];

  var answers = [];
  var couponQRInstance = null;

  function $(sel) {
    return document.querySelector(sel);
  }

  function showScreen(num) {
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-screen") === String(num));
    });
    window.scrollTo(0, 0);
    if (num === 7) fillResult();
  }

  function runIntro() {
    var l1 = $(".intro-line--1");
    var l2 = $(".intro-line--2");
    var l3 = $(".intro-line--3");
    var btn = $("#btnStart");
    [l1, l2, l3].forEach(function (el) {
      el.classList.remove("is-visible");
    });
    btn.disabled = true;

    setTimeout(function () { l1.classList.add("is-visible"); }, 100);
    setTimeout(function () { l2.classList.add("is-visible"); }, 500);
    setTimeout(function () { l3.classList.add("is-visible"); }, 900);
    setTimeout(function () { btn.disabled = false; }, 1200);
  }

  function resetQuiz() {
    answers = [];
  }

  function scorePercent() {
    var n = 0;
    for (var i = 0; i < CORRECT.length; i++) {
      if (answers[i] === CORRECT[i]) n++;
    }
    return n * 20;
  }

  function bindQuizScreen(screenEl) {
    var q = parseInt(screenEl.getAttribute("data-q"), 10);
    screenEl.querySelectorAll(".opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        answers[q] = idx;
        showScreen(3 + q);
      });
    });
  }

  function fillResult() {
    var pct = scorePercent();
    $("#scorePercent").textContent = "\u2014\u6b63\u786e\u7387 " + pct + "%\u2014";
    var ok100 = $("#resultActions100");
    var fail = $("#resultActionsFail");
    ok100.classList.add("hidden");
    fail.classList.add("hidden");
    if (pct === 100) {
      ok100.classList.remove("hidden");
    } else {
      fail.classList.remove("hidden");
    }
  }

  function initCouponQr() {
    var el = $("#couponQr");
    if (!el) return;
    if (couponQRInstance) {
      couponQRInstance.clear();
      couponQRInstance = null;
    }
    couponQRInstance = new QRCode(el, {
      text: COUPON_QR_URL,
      width: 220,
      height: 220,
      colorDark: "#3f0d1a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  function openEnvelopeThenPage8() {
    var overlay = $("#envelopeOverlay");
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.remove("is-open");
    void overlay.offsetWidth;
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
    setTimeout(function () {
      overlay.classList.add("hidden");
      overlay.removeAttribute("aria-hidden");
      overlay.classList.remove("is-open");
      showScreen(8);
      initCouponQr();
    }, 2400);
  }

  $("#btnStart").addEventListener("click", function () {
    resetQuiz();
    showScreen(2);
  });

  document.querySelectorAll(".screen[data-q]").forEach(bindQuizScreen);

  $("#btnOpenLetter").addEventListener("click", openEnvelopeThenPage8);

  $("#btnRetry").addEventListener("click", function () {
    resetQuiz();
    showScreen(1);
    runIntro();
  });

  $("#btnSaveImage").addEventListener("click", function () {
    var node = $("#couponCapture");
    if (!node || typeof html2canvas === "undefined") {
      alert("\u4fdd\u5b58\u529f\u80fd\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5\u3002");
      return;
    }
    html2canvas(node, {
      backgroundColor: "#fffaf5",
      scale: Math.min(2, (window.devicePixelRatio || 1) * 1.5),
      useCORS: true,
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) {
          alert("\u751f\u6210\u56fe\u7247\u5931\u8d25\u3002");
          return;
        }
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "\u5c0f\u80e1\u9e2d-\u8346\u5dde\u8bb0\u5fc6\u793c\u5305.png";
        a.click();
        URL.revokeObjectURL(a.href);
      }, "image/png");
    });
  });

  runIntro();
})();

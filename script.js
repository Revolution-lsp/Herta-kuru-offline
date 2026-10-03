// ===== 全局变量 =====
var audioList = [];
let firstSquish = true;
var cachedObjects = {};
var current_language = localStorage.getItem("lang") || "cn";
var localCounter = null;
var counterButton = null;
var localCount = 0;

// ===== 多语言 =====
const LANGUAGES = {
    "en": {
        audioList: ["audio/en/en_1.mp3", "audio/en/en_2.mp3", "audio/en/en_3.mp3"],
        texts: {
            "page-title": "Welcome to herta kuru~",
            "doc-title": "Kuru Kuru~",
            "page-descriptions": "The website for Herta, the <del>annoying</del> cutest genius Honkai: Star Rail character out there.",
            "counter-descriptions": ["The kuru~ has been squished for", "Herta has been kuru~ed for"],
            "counter-unit": "times",
            "counter-button": ["Squish the kuru~!", "Kuru kuru~!"],
            "credits-gif": "Herta gif made by",
            "footer-repository-text": "You can check out the GitHub repository here:",
            "footer-repository-text-2": "herta_kuru repo",
            "footer-title-text": "Game: Honkai: Star Rail"
        },
        cardImage: "img/card_en.jpg",
        link: "https://hsr.hoyoverse.com/en-us/home"
    },
    "cn": {
        audioList: ["audio/cn/gululu.mp3", "audio/cn/gururu.mp3", "audio/cn/要坏掉了.mp3", "audio/cn/转圈圈.mp3", "audio/cn/转圈圈咯.mp3"],
        texts: {
            "page-title": "黑塔转圈圈",
            "doc-title": "咕噜噜~",
            "page-descriptions": "给黑塔酱写的小网站，对，就是那个<del>烦人的</del>最可爱的《崩坏：星穹铁道》角色！",
            "counter-descriptions": ["黑塔已经咕噜噜~了", "黑塔已经转了"],
            "counter-unit": ["次", "次圈圈"],
            "counter-button": ["转圈圈~", "咕噜噜！"],
            "credits-gif": "作者：",
            "footer-repository-text": "源代码在此：",
            "footer-repository-text-2": "herta_kuru 仓库",
            "footer-title-text": "游戏: 崩坏：星穹铁道"
        },
        cardImage: "img/card_cn.jpg",
        link: "https://sr.mihoyo.com/"
    },
    "ja": {
        audioList: ["audio/ja/kuruto.mp3", "audio/ja/kuru1.mp3", "audio/ja/kuru2.mp3"],
        texts: {
            "page-title": "ヘルタクルへようこそ~",
            "doc-title": "クル クル~",
            "page-descriptions": "このサイトはヘルタのために作られた、 あの崩壊：スターレイルの <del>悩ましい</del> かわいい天才キャラー。",
            "counter-descriptions": "クル再生数",
            "counter-unit": "回",
            "counter-button": "クル クル~!",
            "credits-gif": "GIF作成者は",
            "footer-repository-text": "こちらはこのページGitHubリポジトリ:",
            "footer-repository-text-2": "herta_kuru リポジトリ",
            "footer-title-text": "ゲーム: 崩壊：スターレイル"
        },
        cardImage: "img/card_ja.jpg",
        link: "https://hsr.hoyoverse.com/ja-jp/home"
    },
    "kr": {
        audioList: ["audio/kr/kr_1.mp3", "audio/kr/kr_2.mp3", "audio/kr/kr_3.mp3"],
        texts: {
            "page-title": "헤르타빙글 환영합니다~",
            "doc-title": "빙글 빙글~",
            "page-descriptions": "이 웹사이트는 헤르타를 위해 만들어졌습니다, 붕괴: 스타레일 의 <del>귀찮은</del> 귀여운 천재 ",
            "counter-descriptions": "빙글 조회수",
            "counter-unit": "번",
            "counter-button": "빙글 빙글~!",
            "credits-gif": "gif의 제작자입니다",
            "footer-repository-text": "여기 github 리 포지 토리가 있습니다:",
            "footer-repository-text-2": "herta_kuru 리 포지 토리",
            "footer-title-text": "붕괴: 스타레일"
        },
        cardImage: "img/card_kr.jpg",
        link: "https://hsr.hoyoverse.com/ko-kr/home"
    }
};

// ===== 工具 =====
function randomChoice(myArr) {
    return myArr[Math.floor(Math.random() * myArr.length)];
}

function tryCachedObject(origUrl) {
    return origUrl;
}

// ===== 语言渲染 =====
function refreshDynamicTexts() {
    let curLang = LANGUAGES[current_language];
    if (!curLang) return;
    let localTexts = curLang.texts;
    Object.entries(localTexts).forEach(([textId, value]) => {
        if (value instanceof Array) {
            let el = document.getElementById(textId);
            if (el) el.innerHTML = randomChoice(value);
        }
    });
}

function reload_language() {
    let curLang = LANGUAGES[current_language];
    if (!curLang) return;
    let localTexts = curLang.texts;
    Object.entries(localTexts).forEach(([textId, value]) => {
        if (!(value instanceof Array)) {
            let el = document.getElementById(textId);
            if (el) el.innerHTML = value;
        }
    });
    refreshDynamicTexts();

    let card = document.getElementById("herta-card");
    if (card) card.src = curLang.cardImage;

    let gameLink = document.getElementById("game-link");
    if (gameLink) gameLink.href = curLang.link;

    let docTitle = curLang.texts["doc-title"];
    if (docTitle) document.title = docTitle;
}

// ===== 音频 =====
function getLocalAudioList() {
    return LANGUAGES[current_language].audioList;
}

function getRandomAudioUrl() {
    var list = getLocalAudioList();
//    if (current_language === "en" || current_language === "ja" || current_language === "kr") {
//       return list[Math.floor(Math.random() * 2) + 1];
//    }
    return randomChoice(list);
}

function playKuru() {
    let audioUrl;
    if (firstSquish) {
        firstSquish = false;
        audioUrl = getLocalAudioList()[0];
    } else {
        audioUrl = getRandomAudioUrl();
    }
    let audio = new Audio(tryCachedObject(audioUrl));
    audio.play().catch(function (e) {
        console.warn("音频播放失败:", e);
    });
    audio.addEventListener("ended", function () {
        this.remove();
    });
}

// ===== 动画 =====
function animateHerta() {
    let id = null;
    const random = Math.floor(Math.random() * 2) + 1;
    const elem = document.createElement("img");
    elem.src = `img/hertaa${random}.gif`;
    elem.style.position = "absolute";
    elem.style.right = "-500px";
    elem.style.top = counterButton.getClientRects()[0].bottom + scrollY - 430 + "px";
    elem.style.zIndex = "-10";
    document.body.appendChild(elem);

    let pos = -500;
    const limit = window.innerWidth + 500;
    clearInterval(id);
    id = setInterval(() => {
        if (pos >= limit) {
            clearInterval(id);
            elem.remove();
        } else {
            pos += 20;
            elem.style.right = pos + "px";
        }
    }, 12);
}

function triggerRipple(e) {
    if (!counterButton) return;
    let ripple = document.createElement("span");
    ripple.classList.add("ripple");
    counterButton.appendChild(ripple);

    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    setTimeout(() => {
        ripple.remove();
    }, 300);
}

// ===== 初始化 =====
function initApp() {
    localCounter = document.querySelector("#local-counter");
    counterButton = document.querySelector("#counter-button");

    // 语言选择器
    let langSelector = document.getElementById("language-selector");
    if (langSelector) {
        langSelector.value = current_language;
        langSelector.addEventListener("change", (ev) => {
            current_language = ev.target.value;
            localStorage.setItem("lang", ev.target.value);
            reload_language();
        });
    }

    // 计数器：刷新后重置为 0
    localCount = 0;
    if (localCounter) localCounter.textContent = localCount.toLocaleString("en-US");

    if (counterButton) {
        counterButton.addEventListener("click", (e) => {
            localCount++;
            if (localCounter) localCounter.textContent = localCount.toLocaleString("en-US");
            triggerRipple(e);
            playKuru();
            animateHerta();
            refreshDynamicTexts();
        });
    }

    reload_language();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
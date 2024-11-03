// service_worker からのメッセージを受信
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "setClipboardTextForChatwork") {
    setClipboardTextForChatwork(); // グローバル関数を呼び出す
  }
});

/**
 * 申請一覧のURLをコピーでコピーする内容をセットする
 */
function setClipboardTextForChatwork() {
  console.log('setClipboardTextForChatwork');

  // ボタンが既に存在する場合は何もしない
  let button = document.getElementById('btn-chatwork-url');
  if (button !== null) return;

  // tabNav-wrapper.ng-scope要素を取得
  const tabNavWrapper = document.querySelector('div.tabNav-wrapper.ng-scope');
  if (tabNavWrapper === null) return;
  // HTMLを直接挿入
  tabNavWrapper.insertAdjacentHTML('afterend', '<div class="new-button-class"><button id="btn-chatwork-url">【 Chatwork 】<br/>URLをセット</button></div>');
  // ボタン要素を取得しイベントを設定する
  const btnChatworkUrl = document.getElementById('btn-chatwork-url');
  if (btnChatworkUrl === null) return;

  btnChatworkUrl.addEventListener('click', () => {
    // 申請一覧の要素を取得
    const requestElements = document.querySelectorAll('div.one-request');
    requestElements.forEach(request => {
      setDataClipboardText(request);
    });
  });
  console.log('end setClipboardTextForChatwork');
}

/**
 * 申請タイトルとURLをセット
 * @param {申請要素} request
 */
function setDataClipboardText(request) {
  // 申請タイトルを取得
  const title = getTitle(request);

  // 申請のURLを設定する
  const spanElements = request.querySelectorAll('span.ng-isolate-scope');
  spanElements.forEach(span => {
    // tooltipを設定
    const iElement = span.querySelector('i.fa-link');
    if (iElement) {
      iElement.setAttribute('title', '[Chatwork]URLをコピー');
    }

    // URLを取得して、Chatwork用のフォーマットに変換
    // NOTE: data-clipboard-text属性に設定することでコピーできるようにする
    const url = span.getAttribute('data-clipboard-text');
    if (url) {
      const formattedUrlForChatwork = `[info][title]${title}[/title]${url}[/info]`;
      span.setAttribute('data-clipboard-text', formattedUrlForChatwork);
    }
  });

  console.log('setDataClipboardText');
  chrome.tabs.sendMessage(tab.id, {cmd: 'toast', msg: 'クリップボードにコピーされました'});
}

/**
 * 申請タイトルを取得
 * @param {申請要素} request 
 * @returns 申請タイトル
 */
function getTitle(request) {
  // 申請のタイトルを取得
  const titleElement = request.querySelector('h4.item-title');
  let title = '';
  titleElement.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      title = node.textContent.trim();
    }
  });
  return title;
}

console.log("jobcan_wf_content.js has been loaded");

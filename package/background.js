chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyBacklogInfoToClipboard",
    title: "[Backlog]課題情報をコピー",
    contexts: ["all"],
    documentUrlPatterns: ["https://sksp.backlog.jp/view/*"]
  });
  chrome.contextMenus.create({
    id: "copyScheduleToClipboard",
    title: "[Outlook]スケジュールをコピー",
    contexts: ["all"],
    documentUrlPatterns: ["https://outlook.office.com/calendar/item/*"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch(info.menuItemId)
  {
    // Baclog課題キーコピー
    case "copyBacklogInfoToClipboard":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copyBacklogInfoToClipboard
      });
      break;
    // Outlookスケジュール情報コピー
    case "copyScheduleToClipboard":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copyScheduleToClipboard
      });
      break;
  }
  }
);

/**
 * Backlog課題情報をクリップボードにコピー
 */
function copyBacklogInfoToClipboard() {
  const titleSelector = document.querySelector('h2#summary');
  if (titleSelector === null) return;

  const title = titleSelector.textContent;
  const url = window.location.href;
  const scheduleInfo = [
    `[info][title]${title}[/title]`,
    `${url}`,
    `[/info]`
  ];
  navigator.clipboard.writeText(scheduleInfo.join('\n')).then(() => {
    alert("クリップボードにコピーされました");
  }).catch(err => {
    console.error("Failed to copy to clipboard: ", err);
  });
}

/**
 * スケジュール情報をクリップボードにコピー
 */
function copyScheduleToClipboard() {
  console.log("Executing getSchedule function");
  const title = document.querySelector(".CWGkB").innerText;
  const timeElement = document.querySelector(".y79CD");
  let time = '';
  if (timeElement) {
    for (let node of timeElement.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      time = node.nodeValue.trim();
      break;
    }
    }
  }
  const url = window.location.href;
  console.log(url);
  const scheduleInfo = `[info][title]${title}[/title]\n${time}\n${url}\n[/info]`;
  navigator.clipboard.writeText(scheduleInfo).then(() => {
    alert("クリップボードにコピーされました");
  }).catch(err => {
    console.error("Failed to copy to clipboard: ", err);
  });
}

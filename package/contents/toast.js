var toast = document.createElement('div');
toast.style.zIndex = '999';
toast.style.visibility = 'hidden';
toast.style.position = 'fixed';
toast.style.left = '50%';
toast.style.top = '50%';
toast.style.backgroundColor = '#888888';
toast.style.color = '#ffffff';
toast.style.padding = '10px';
toast.style.fontWeight = 'bolder';
document.body.insertBefore(toast, document.body.firstChild);

// トーストコマンドが来たらメッセージを表示する
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'toast') {
        toast.innerHTML = request.message;
        toast.style.visibility = 'visible';
        setTimeout(function() {
            toast.style.visibility = 'hidden';
        }, 1000);
    }
});
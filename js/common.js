/*
    @param color str
    @param msg str
    保存時のフラッシュ表示
*/
const flash = (color, msg) =>
{
    DOM.flash.classList.add(`alert-${color}`);
    DOM.flash.textContent = msg;
    DOM.flash.classList.remove('hidden');
    setTimeout(() => {
        DOM.flash.classList.remove(`alert-${color}`);
        DOM.flash.classList.add('hidden');
    }, 2000);
}

/*
    @param bool bool
    ページ読み込み時、保存時のローディング表示
*/
const loading = bool =>
{
    if(bool){
        DOM.loading.classList.remove('hidden');
    } else {
        DOM.loading.classList.add('hidden');
    }
}

/*
    @param str str
    @param len int
    return str
    文字を一定長で切り取って...を加える
*/
const subStr = (str, len) =>
{
    if(str.length > len){
        str = str.substring(0, len) + '...';
    }
    return str;
}

/*
    @param text str
    return str
    文字列内のURLをaタグに変換する
*/
const makeLink = text =>
{
    const regexp_url = /(https?):\/\/(([a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    const regexpMakeLink = url => {
        return `<a href="${url}" target="_blank">${url}</a>`;
    }
    const url_matchs = text.match(regexp_url);
    if(url_matchs){
        url_matchs.forEach(url => {
            text = text.replaceAll(url, regexpMakeLink(url));
        });
    }
    return text;
}

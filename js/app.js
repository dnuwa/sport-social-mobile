$('.toggle-pages').click(function(){
    $('.pages-list').toggle(1000)
})
$('.toggle-groups').click(function(){
    $('.groups-list').toggle(1000)
})

function trimText(className, stringLength){
    let textToTrim = $(`.${className}`).text();
    let arr = textToTrim.split('');
    let trimmedText;
    arr.length > stringLength ? trimmedText = arr.slice(0,stringLength).join('') + '...' : trimmedText = arr.join('');
    return $(`.${className}`).html(trimmedText)
}
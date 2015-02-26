---
---
function ready(fn){
    if(document.readyState != 'loading'){fn();}
    else {document.addEventListener('DOMContentLoaded', fn); }
};

var posts = [
    {% for post in site.posts %} "{{ post.title | strip_html }}", {% endfor %}
];

ready(function(){
    var search_i = document.getElementById('searcha');
    new Awesomplete(search_i, {
        minChars: 2,
        maxItems: 15,
        list: posts,
        autoFirst: true
    });
});

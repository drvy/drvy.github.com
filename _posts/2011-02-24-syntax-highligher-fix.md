---
layout: post
title: "Syntax Highlighter Scrollbar Fix"
date: 2011-02-24 00:00:00
categories: fix
tags: fix
shortUrl: http://goo.gl/ea0S15
---

Para los que usan la librería de "Syntax Highligter" y acceden a ella directamente desde el host del autor hay ciertos bugs. Este es uno que yo odio mucho y es que aunque no necesite que salgan las barras de scroll salen.

Arreglar scrollbar en Syntax Highlighter
====

La razón de ello es el overflow que trae la propiedad .syntaxhighlighter en su "Default Theme". Es bastante sencillo solucionarlo. Simplemente añadir un css que indique esto:

{% highlight css %}
<style type="text/css">
    .syntaxhighlighter { overflow-y: hidden !important; }
</style>
{% endhighlight %}

Saludos
---
layout: post
title: "4 &ldquo;consejos&#8221; exagerados sobre optimización en PHP."
date: 2013-06-15 00:00:00
categories: php
tags: consejos,php
shortUrl:
---

Se dan muchos consejos sobre optimización en PHP y he visto gente que le grita a otros _(yo me incluyo)_ sobre usar `echo` en vez de `print`... usar comillas simples en vez de dobles... etc. Aquí van 4 &ldquo;consejos&#8221; exagerados sobre optimización en PHP.

Usar echo en vez de print.
---

Si es cierto que `print` en si es una función y por tanto devuelve algo. En cambio `echo` solo se encarga de imprimir pero la verdad es que la diferencia es prácticamente nula.

En [este sitio](http://fabien.potencier.org/article/8/print-vs-echo-which-one-is-faster) lo analizan a base de VLD _(Vulcan Logic Disassembler)_. El resultado es que `print` usa solo un _opcode_ (unidad de ejecución) mas que `echo`.

Yo siempre digo que use echo a no ser que necesites realmente utilizar `print` pero el coste es realmente barato. Tiempo de ejecución:

    echo  -> 0.0049898624420166 segundos.
    print -> 0.0065829753875732 segundos.

Comillas dobles vs simples
---

Como las comillas dobles &ldquo;parsean&#8221;, se asume que son mas lentas que las simples. En las ultimas versiones de PHP, esto es mas bien un &#8221;mito&ldquo; falso. Pues de hecho, en algunas ocasiones, las simples pueden llegar a ser mas lentas que las dobles. Tiempo de ejecución:

    dobles  -> 0.0044369697570801 segundos.
    simples -> 0.0043721199035645 segundos.

$i++ vs ++$i
---

Puesto que para post-incrementar _($i++)_, PHP copiara el valor de `$i` en la memoria interna, le sumara 1 y devolverá, se considera que es mas lento que pre-incrementar _(++$i)_ que solo incrementa y devuelve... Tiempo de ejecución:

    $i++ -> 0.00017093254089355 segundos.
    ++$i -> 0.00015902519226074 segundos.


Switch vs If/Else
---
Realmente no se de donde salio este &ldquo;consejo&#8221; pero se supone que switch es mas rápido que if/else... Tiempo de ejecución:

    switch  -> 0.0004727840423584 segundos.
    if/else -> 0.0004851139068603 segundos.


Saludos

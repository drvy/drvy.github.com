---
layout: post
title: “$.each” de jQuery vs “for” de JavaScript.
date: 2012-12-11 00:00:00
categories: benchmark, jQuery
tags: benchmark, jquery
shortUrl:
---

Después de una discusión con un amigo sobre cual de estos dos métodos seria el mas rápido para parsear
un array, decidí hacer un benchmark. Aunque los dos coincidíamos en que al principio no habría prácticamente
ninguna diferencia, nuestro desacuerdo estaba sobre los arrays grandes.

Medir tiempo de ejecución.
---
Si tu navegador dispone de una consola javascript seguramente también dispondrá de las funciones
*console.time()* y *console.timeEnd()*. Estas funciones se usan para determinar cuanto tiempo
tarda la ejecución de un dado código.

{% highlight js %}
/* Iniciar timer */
console.time('nombre_evento');

 algo_de_javascript();

/* Finalizar timer */
console.timeEnd('nombre_evento');
{% endhighlight %}

Se elabora un simple test.

{% highlight js%}
<script type="text/javascript" src="jquery.js"></script>
<script>
   var array_test=new Array('arrayyyyyyyyyyyyyyy');

   /* Iniciamos bucle for nativo. */
   console.time('for-nativo');
   /* Bucle */
   for(i=0; i<array_test.length; i++){array_test[i];}
   /* Paramos bucle for nativo */
   console.timeEnd('for-nativo');

   ////////////////////////////////////////

   /* Iniciamos bucle $.each jquery */
   console.time('each-jquery');
   /* Bucle */
   $.each(array_test,function(index,valor){valor;});
   /* Paramos bucle $.each jQuery */
   console.timeEnd('each-jquery');

</script>
{% endhighlight %}

El array en realidad es un *stringArray*.

    array_test=new Array("00", "01", "02", "03", "04");

Y fui aumentando el numero de elementos de 10 a 100, 10000, 100000 y finalmente 1000000. Al principio no se notaba gran diferencia pero luego fue aumentando.

    FOR NATIVO
    ---------
    10 - 1ms
    10000 - 9ms
    100000 - 65ms
    1000000 - 752ms

    $.each Jquery
    ---------
    10 - 1ms
    10000 - 11ms
    100000 - 154ms
    1000000 - 1512ms

Como podéis ver si el array no excede de 100 mil elementos la diferencia entre *$.each* y *for* es casi nula pero luego va aumentando considerablemente.

La sorpresa
---

Me dio por crear un array con un numero de index predeterminado.

    var array_test=new Array(100000);

Como sabréis, esto solo crea un array con un lenght de 100000. Pero los elementos son "undefined" o sea vacíos. Mi sorpresa fue ver esto:

    FOR NATIVO
    ---------
    100000 - 1ms

    $.each Jquery
    ---------
    100000 - 147ms

Al parecer el *for* nativo de JavaScript se da cuenta de que el array esta "vació" y no se molesta en procesarlo. Sin embargo el *$.each* de jQuery si lo hace..

Saludos
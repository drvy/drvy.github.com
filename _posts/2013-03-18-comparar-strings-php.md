---
layout: post
title: "Porque NUNCA comparar un string con == en PHP."
date: 2013-03-18 00:00:00
categories: php
tags: php
shortUrl:
---

Hace poco, leí [en el foro](http://whk.elhacker.net/index.php/topic,2986.msg2831/topicseen.html) de una persona a la que respeto mucho (WHK) que SMF tenia un fallo que permitía resetear las contraseñas de cualquier usuario a base de un “bruteforce ligero”.

El fallo esta en que generan un token en MD5 y solo comparan los 10 primeros caracteres de este (*¿a quien se le ocurre esto?*). Resulta que si lo comparas con el operador **==** y/o **!=**, este puede interpretar directamente los valores que se le pasan como numéricos e incluso realizar operaciones matemáticas.

De esta forma, podemos realizar notación exponencial y elevar a 0/1 cualquier token cuyos 10 primeros caracteres sean numéricos. Os dejo un ejemplo:

    md5(5136) == [0e79548081]b4bd0df3c77c5ba2c23289
    md5(8301) == [1e79596878]b2320cac26dd792a6c51c9

Como veis, estos md5 elevan el primer numero a los 8 restantes. Recordemos que si elevamos 0 a cualquier numero el resultado sera 0. Lo mismo pasa con el 1. Entonces, si comparamos estos 2 “strings” con == o !=, literalmente estaremos comparando 0 con 1 y viceversa.

Ahora, no hace falta nada mas que cambiarle el 0 a 1 al primer md5 o viceversa (cambiar el 1 por 0). Estaremos comparando 0 con 0 o 1 con 1.

El fallo
---

SMF utiliza(ba) esta comparacion:

    if (empty($_POST['code']) || substr($realCode, 0, 10) != substr(md5($_POST['code']), 0, 10))

Como veis, recorta *$realCode* y el código introducido por nosotros a 10 caracteres y los compara con !=. Literalmente lo que esta haciendo es lo siguiente:

{% highlight php %}
<?php
$realcode = 0e79548081; //... b4bd0df3c77c5ba2c23289 (valor generado)
$fakecode = 1e79596878; //... b2320cac26dd792a6c51c9 (valor introducido)
if ($realcode != $fakecode){
    echo 'No coinciden';
} else {
    echo 'Coinciden';
}
?>
{% endhighlight %}

Esto mostrara que **No coinciden** porque 0 comparado con INF(*resultado de la operación llevada en $fakecode*) da FALSE. PERO, si a la variable $fakecode le cambiamos el primer numero por 0 o a $realcode le cambiamos el primer numero por 1....mostrara: Coinciden. En base a esto, se puede realizar un “bot” que vaya probando un md5 y obviamente en un dado momento ambas coincidirán y por tanto la contraseña sera reseteada.

La solución
---

**1.** Lo que nunca deberíamos hacer es recortar el token. Es prácticamente imposible que el resultado de encriptar algo en MD5 genere un “string” entero de números y que el segundo carácter sea una e.

**2. Utilizar !== y === siempre que vayamos a comprar strings.** === compara si los strings son idénticos y no si son iguales (hay diferencia). Ademas de esto, un punto muy a favor por el cual debemos utilizar === en vez de == a la hora de comparar strings es este simple código:

    if('abcd'==0){echo 'Coinciden';} else {echo 'No coinciden';}

Solo os diré que la comparación **devuelve TRUE =)**. Esto se debe a que si a la hora de comparar 2 parámetros uno de ellos es numérico, el otro también se compara como si fuese numérico. Y, obviamente:

    $variable = (int)'abcd' // convertir abcd a integro;
    echo $variable; // Devuelve 0

Saludos
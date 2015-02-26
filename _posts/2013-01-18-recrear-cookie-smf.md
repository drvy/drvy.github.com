---
layout: post
title: Recrear COOKIE de SMF.
date: 2013-01-18 00:00:00
categories: SMF, cookie
tags: SMF, cookie
shortUrl:
---

Introducción
---
Para los que no lo sepan, [SMF](http://simplemachines.org) (Simple Machines Forum) es un CMS para crear tu propio foro. La cosa es que si deseas integrarlo con tu sitio web aparte, debes utilizar una API no oficial o el [SSI.php](http://www.simplemachines.org/community/ssi_examples.php) que incluye el CMS.

Ninguna de estas 2 cosas me convence. La API principalmente porque no es oficial y no tiene soporte y el SSI porque trae demasiadas cosas inútiles si lo que se quiere es simplemente hacer un login. Ademas, si quieres integrar el login_ssi debes indicar una session para que no te redireccione directamente al index del foro.. son demasiados lios para un simple login.

Resulta, que estas cosas se deberían encontrar en la documentación de SMF o buscando en Google. PERO, parece que a los desarrolladores de SMF no les convence que nosotros mismos creemos nuestras sessiones. La razón según ellos: “No ayudamos a hacer SMF (el foro) mas inseguro”. Me parece una estupidez pero es lo que hay.

En [este enlace](http://www.simplemachines.org/community/index.php?topic=488078.0), podéis encontrar a un usuario que hasta ofreció dinero para que le digan como hacerlo... la respuesta que recibió es la que cito mas arriba.

La verdad es que el staff de SMF deja mucho que desear pero bueno. He estado hurgando en los archivos (Sources) de SMF y he descubierto lo que hace falta.

Recreando la cookie
---

Para empezar vamos a analizar lo que contiene la cookie de SMF una vez nos logueamos dentro. Con este simple código, podemos ver lo que contiene la cookie.

{% highlight php %}
<?php
$data = $_COOKIE['SMFCookie956'];
print_r($data);
?>
{% endhighlight %}

A tener en cuenta es que el nombre de la *$_COOKIE* es aleatorio para cada instalación SMF. Podéis ver el vuestro en el archivo **Settings.php** bajo la variable *$cookiename*.


El resultado del código de arriba en mi caso es este:

    a:4:{i:0;s:1:"4";i:1;s:40:
    "f1deff63eaefee8da7eba057991de483fa8fe0ff"
    ;i:2;i:1358471211;i:3;i:2;}

Obviamente varia muchísimo dependiendo de muchas cosas. Pero la estructura es la misma. El caso es que esto esta [serializado](http://es2.php.net/manual/es/function.serialize.php). Al [des-serializarlo](http://es2.php.net/manual/es/function.unserialize.php), obtenemos esto:

    Array
    (
        [0] => 4
        [1] => f1deff63eaefee8da7eba057991de483fa8fe0ff
        [2] => 1358471211
        [3] => 2
    )

De aquí podemos obtener 4 datos. Según el archivo **Subs-Auth.php**, estos datos son:

[0] => ID del usuario

[1] => passwd.salt => contraseña del usuario + salt.

[2] => El time() en el que se creo la cookie + su duración.

[3] => El tipo de cookie.

Según SMF, el tipo de cookie puede ser 0, 1 ó 2. 0 es no definida, 1 es local cookie, 2 es global cookie. En 0, la cookie no seria valida, en 1 la cookie solo afectaría al subdominio donde esta y en 2 la cookie podría ser de cualquier subdominio dentro de la pagina.

Teniendo estos datos es bastante sencillo recrear la cookie. Aquí os dejo un script comentado de como hacerlo.

{% highlight php %}
<?php
// Se obtiene de Settings.php
$cookiename = 'SMFCookie956';

// Base de datos... member_id
$id = '4';

// SHA1 - Contraseña del usuario.
// Si usan la base de datos para el usuario, este es member_name
// de la tabla smf_members
$passwd = sha1(strtolower('usuario').'contraseña');

// El salt. ES ALEATORIO POR CADA USUARIO
// Segun se SMF lo genera asi: $salt = substr(md5(rand(0,9999)),0,4);
$salt = 'd33c';

// Unimos el passwd y el salt.
$pwd_salt = sha1($passwd.$salt);

// Tiempo actual + tiempo que duraria la cookie (el que quieran)
$time = time()+9999;

// Tipo de cookie. Yo lo pongo en Global pero puede ser 1= local.
$type = 2;

// Hacemos serialize en array
$data['final'] = serialize(array($id,$pwd_salt,$time,$type));

// Ponemos la cookie
setcookie($cookiename,$data['final']);
?>
{% endhighlight %}

Con esto, tendríamos la cookie definida y si entramos a SMF estaríamos logueados. Sin mas, espero que os sirva. Y de paso, a ver si los del staff de SMF se ponen las pilas con usuarios que quieren integrar sus webs de manera mas eficiente.

Saludos


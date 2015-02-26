---
layout: post
title: "¿MD5, SHA1, SHA256, SHA3? Olvidalos... bcrypt!"
date: 2013-11-25 00:00:00
categories: php,seguridad
tags: php,bcrypt
shortUrl:
---
La verdad es que &ldquo;nacer&#8221; en un [foro de seguridad](http://foro.elhacker.net/index.php), me ha tocado lo suyo y siempre intento meterle seguridad a mis paginas.. desde inputs trampa para los bots hasta site-salts para las bases de datos. Pero aquí llega algo en lo que no me había parado a pensar. ¿De que sirve tanto hasheo ante una maquina potente?

Hoy en día te puedes comprar hardware tan potente que hasta da miedo por algo mas de 2000 euros. Con un buen SLI y muchos CUDA's puedes llegar a probar hasta [600,000 hashs](http://www.win.tue.nl/cccc/sha-1-challenge.html) por segundo. ¿De que sirve ahí, un algoritmo hecho para calcular con velocidad?

### Indice
- [¿Por que no usar sha1, sha512, md5 o parecidas?](#No)
- [Los salts no ayudan.](#Salts)
- [bCrypt.](#bCrypt)
- [Utilizar bCrypt en PHP.](#bCryptPHP)
    - [Usando crypt nativo (>=5.3.7) (recomendado).](#Crypt)
    - [Usando password_hash nativo (PHP>=5.5-DEV).](#PasswordHash)
    - [Usando PHPASS (terceros) (PHP 5.3*).](#PHPASS)
    - [Usando Zend\Crypt (Zend framework v2).](#Zend)
    - [Usando PHP-PasswordLib (terceros) (PHP>=5.3.2).](#PasswordLib)
- [Posibles problemas](#Problemas)
    - [Versiones inferiores a PHP 5.3.](#Versiones)
    - [Usar el prefix equivocado.](#Prefix)
    - [Ataques de timing.](#Timing)
    - [¿DoS? (denial-of-service).](#DoS)

## ¿Por qué no usar sha1, sha512, md5 o parecidas? <a name='No'></a>
Básicamente porque son algoritmos hechos para calcular cantidades grandes de información en el menor tiempo posible. Son muy útiles para asegurar la integridad de la información pero no son &ldquo;aptos&#8221; para guardar contraseñas.

Un servidor moderno puede calcular un hash MD5 de [330mb por segundo](http://www.cryptopp.com/benchmarks-amd64.html). Si un usuario utiliza una contraseña alfanumérica, letras minúsculas y de 6 caracteres de longitud, podrías intentar cualquier posible combinación de ese tipo en alrededor de **40 segundos**.


## Los salts no ayudan <a name='Salts'></a>
Hay que mencionar que si un atacante obtiene acceso a la BD los salts automáticamente se vuelven inútiles. Se puede &ldquo;tapar&#8221; un poco utilizando los (como yo los llamo) site-salts que básicamente son salts implementados en el código en vez de en la BD, pero eso no es mas que eso... tapar. Da igual si el salt es único o diferente para cada usuario, si la BD cae, también lo hacen los salts. De este modo, aunque cueste mas tiempo, se puede atacar al hash simplemente añadiendo el salt.


## bCrypt <a name='bCrypt'></a>
Al rescate viene bcrypt. Usa una variante del [Key schedule](https://en.wikipedia.org/wiki/Key_schedule) de [Blowfish](https://es.wikipedia.org/wiki/Blowfish) e introduce un factor de trabajo el cual te permite determinar que tan costoso seria el hecho de generar un hash. En otras palabras, puedes limitar el tiempo en el que tarda en generar un hash.

Gracias a esto, mientras mas rápido es el ordenador que procesa, se puede incrementar mas el factor de trabajo para que tarde mas en calcular el hash.

**¿Que tan lento es bcrypt comparado con SHA1?**

En realidad depende del factor de trabajo, pero para dar un ejemplo, con un factor de trabajo 12 y un Pentium 4:

    SHA1 = 0.00 segundos.
    BCRYPT = 0.40332102775574 segundos.


## Utilizar bCrypt en PHP <a name='bCryptPHP'></a>

Lo cierto es que es un poco liante. Yo mismo cuando me puse a leer posts, me perdí a medio camino. Cada uno recomendaba una cosa... que si funciones build-in en PHP.. que si librerías, que si métodos propios..

Lo que si que queda claro, es que si queremos usar funciones nativas de PHP, hay que utilizar SI o SI una versión igual o superior a 5.3.0... y dado que se han encontrado errores en dichas versiones, 5.3.7 seria la mínima.

Alternativamente podemos utilizar una librería o framework. Uno de los mas famosos (implementado en proyectos como Wordpress 2.5+ o phpBB3) es PHpass. Otras son la de ZEND y/o PHP-Password-Lib. Pero vamos por partes:

### Usando crypt nativo (>=5.3.7) (recomendado) <a name='Crypt'></a>
Desde PHP 5.3.0 se implementa nativamente crypt. Aunque crypt esta presente desde PHP 4, no es hasta 5.3.0 cuando bCrypt se vuelve &ldquo;utilizable&#8221;.

{% highlight php %}
<?php
// El salt para bcrypt debe ser de 22 caracteres base64 (solo [./0-9A-Za-z])
// Esto es un ejemplo; Por favor usa algo mas seguro/aleatorio que sha1(microtime) :)
$salt = substr(base64_encode(sha1(microtime(true), true))), 0, 22);
$salt = str_replace(array('.','='), '', $salt);

// 2a es el selector para el algoritmo bcrypt, lee http://php.net/crypt
// 12 es el factor de trabajo (unos 300ms en un Core i7).
$hash = crypt('foo', '$2a$12$' . $salt);

// Ahora podemos usar el hash generado como argumento para crypt
// ya que incluye $2a$12 y crypt lo detecta automaticamente.
var_dump($hash == crypt('foo', $hash)); // true
var_dump($hash == crypt('bar', $hash)); // false

?>
{% endhighlight %}

Fuentes -
[bcrypt in PHP](https://gist.github.com/dzuelke/972386),
[PHP: crypt](http://php.net/crypt).

___


### Usando password_hash nativo (PHP>=5.5-DEV) <a name='PasswordHash'></a>
A partir de PHP 5.5 se implementa `password_hash`. Bastante útil y sencillo de utilizar.

{% highlight php %}
<?php
// Definir el factor de trabajo. Tambien podemos utilizar 'salt'=>salt
// para definir nuestro propio salt
// lee http://php.net/manual/en/function.password-hash.php
$options = array('cost' => 12);
$hash = password_hash('foo', PASSWORD_BCRYPT, $options);

// Para verificar utilizamos password_verify
var_dump(password_verify('foo', $hash)); // true
var_dump(password_verify('bar',$hash)); // false

?>
{% endhighlight %}

Fuentes -
[PHP: password_hash](http://php.net/manual/en/function.password-hash.php),
[PHP: password_verify](http://us3.php.net/password_verify).

___


### Usando PHPASS (terceros) (PHP 5.3*) <a name='PHPASS'></a>
Notese que aunque el framework ofrece soporte hasta para PHP 3, bCrypt no se puede utilizar si no se cuenta con PHP 5.3.. a cambio ofrece otros métodos seguros y compatibles.

{% highlight php %}
<?php
require('PasswordHash.php');
// FALSE para no utilizar portable_hash (demostrado no seguro).
$Hasher = new PasswordHash(8, FALSE);
$hash = $Hasher->HashPassword('foo');

// Usamos CheckPassword para verificar.
var_dump($pwdHasher->CheckPassword('foo', $hash)); // true
var_dump($pwdHasher->CheckPassword('bar', $hash)); // false

?>
{% endhighlight %}

Fuentes -
[Pagina oficial](http://www.openwall.com/phpass/).

___


### Usando Zend\Crypt (Zend framework v2) <a name='Zend'></a>
El framework de Zend también permite usar bCrypt. Bastante fácil y sencillo.

{% highlight php %}
<?php
use Zend\Crypt\Password\Bcrypt;
$bcrypt = new Bcrypt();
// Factor de trabajo 12.
$bcrypt->setCost(12);
// Hash
$hash = $bcrypt->create('foo');

// Validar
var_dump($bcrypt->verify('foo', $hash)); // true
var_dump($bcrypt->verify('bar', $hash)); // false

?>
{% endhighlight %}

Fuentes -
[Documentacion Zend](http://framework.zend.com/manual/2.0/en/modules/zend.crypt.password.html),
[Fuente y mas info](http://websec.io/2013/01/21/Password-Hashing-with-Zend-Crypt.html).

___


### Usando PHP-PasswordLib (terceros) (PHP>=5.3.2) <a name='PasswordLib'></a>
Esta es la librería que recomendaría si no existiese `crypt()`. Es capaz de generar una serie de hashs (Drupal, Joomla, phpbb, bcrypt..) y esta hecha para ser portable y fácil de usar.

{% highlight php %}
<?php
require_once '/path/to/PasswordLib.phar';
// Muy similar a crypt. 'cost' seria el factor de trabajo, 2a seria bcrypt.
$hash = $lib->createPasswordHash('foo', '$2a$', array('cost' => 12));

var_dump($lib->verifyPasswordHash('foo', $hash)); // true
var_dump($lib->verifyPasswordHash('bar', $hash)); // false

?>
{% endhighlight %}

Fuentes -
[Github](https://github.com/ircmaxell/PHP-PasswordLib)


___

## Posibles problemas <a name='Problemas'></a>
La verdad es que el uso de bCrypt puede generar unos cuantos problemas (tanto a nivel código como de seguridad).


### Versiones inferiores a PHP 5.3 <a name='Versiones'></a>
El metodo `crypt` en versiones inferiores puede ocasionar muchos problemas. Por ejemplo utilizar un salt al estilo bCrypt en las versiones inferiores puede hacer que crypt calcule el hash en DES en vez de blowfish haciendo lo mucho mas débil.

    var_dump(crypt('foo', '$2a$04$thisisasaltthisisasale'));

- **PHP 5.3+**: `"$2a$04$thisisasaltthisisasaleDjUpLNqciaokdZZwyr82a58CUDIz/Se"`
- **PHP 4.3.0 => 5.2.9**: `string(13) "$2zJyhpjk3l9E"`


### Usar el prefix equivocado <a name='Prefix'></a>
Cuando se descubrieron los errores y fueron arreglados en PHP 5.3.7, `crypt` paso a utilizar varios prefix para bCrypt. El de por defecto ($2a$), el &ldquo;legacy&#8221; ($2x$) y el nuevo ($2y$). Así que si vas a utilizar tu script en servers nuevos y con PHP >=5.3.7 quizás deberías utilizar $2y$ en vez de $2a$.


### Ataques de timing <a name='Timing'></a>
Un ataque de timing es cuando un atacante manda muchos request cambiando ligeramente cada uno de ellos. Esto sirve para averiguar cuanto tarda el servidor en procesar la consulta. En ciertos casos podrá medir los tiempos para discernir los resultados de una comparación. (suponiendo que sabe como su input afecta a uno de ellos).


### ¿DoS? (denial-of-service) <a name='DoS'></a>
No se si se acuerdan de un [reciente caso](http://arstechnica.com/security/2013/09/long-passwords-are-good-but-too-much-length-can-be-bad-for-security/) en el que django tuvo que parchear su codigo para prevenir DoS a base de contraseñas largas.

El problema era que Django no ponía limite a las contraseñas (¿Quien lo haría?). Eso con un algoritmo tipo md5 o sha1 no es gran problema ya que (como mencione) están hechos para calcular el hash a la mayor velocidad posible.. pero que pasa si el algoritmo esta hecho para tardar ?

Resulta que a base de mandar contraseñas de 1mb o mas un servidor corriendo Django podía tardar hasta 1 minuto en calcular el hash... haciendo el DoS perfectamente viable.

La solución de Django fue limitar las contraseñas a 4096 bytes (4Kb). Difícilmente alguien va a utilizar una contraseña tan larga en un sitio web corriente....

Saludos
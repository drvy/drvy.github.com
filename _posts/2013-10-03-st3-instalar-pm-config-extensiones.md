---
layout: post
title: "Sublime Text 3 - Instalando PC, configuración, extensiones y tips."
date: 2013-10-03 00:00:00
categories: sublime text
tags: sublime, ST3
shortUrl:
---

Bueno, pues desde la build 3047, **Sublime Text 3** beta esta disponible también para los usuarios que no tienen licencia de uso. La única limitación parce ser que al guardar el documento 5 veces, se te mostrara una alerta y luego ya no volverá a aparecer... (según he probado) así que se puede decir que no hay problema con eso.

En general, se han ido añadiendo muchas novedades de las cuales la mas populares parecen ser el inicio mas rápido, el _GOTO DEFINITION_ y varias mejoras en la velocidad a la hora de reemplazar en documentos grandes.

### Indice
- [Sublime Text 3](#SublimeText)
- [Instalar el Package Control](#PackageControl)
- [Configuraciónn](#Configuracion)
- [Extensioness](#Extensiones)
- [Tips y workflow.](#Workflow)

## Sublime Text 3 <a name='SublimeText'></a>


Podéis descargar el editor y ver su changelog entero [aquí](http://www.sublimetext.com/3). Como siempre, recomiendo descargar la versión portable ya que esta utiliza su propio directorio para instalar los paquetes/extensiones y configuraciones. Así, todo se mantiene mucho mas organizado.

___

## Instalado el Package Control <a name='PackageControl'></a>

La forma mas rápida de instalar el Package Control es ir a su [sitio oficial](https://packagecontrol.io/installation), copiar el código y pegarlo en la consola de Sublime.

Para abrir la consola basta con ir al menú **View** y elegir **Show Console**. Una vez instalado, hay que reiniciar Sublime. Para abrir el menú, como siempre **Ctrl + Shift + P**.

___

## Configuración <a name='Configuracion'></a>

Quizás una de las cosas mas importantes es la configuración. A mi personalmente la que viene por defecto no me agrada demasiado así que os dejare mas o menos la que uso y su descripción. Por supuesto, para gustos los colores.

Para abrir la configuración hay que ir a **Preferences**, **Settings - Default**. Sin embargo, recomiendo que los cambios se hagan en **Settings - User**, pues así se mantendrán incluso aunque ST se actualice o algo cambie. De todos modos, desde hace algunas builds, ST por defecto no tiene el _Settigs - Default_ como _read-only_.


`font-face` - Para fuente yo suelo utilizar [**Source Code Pro**](http://blog.typekit.com/2012/09/24/source-code-pro/) que es una fuente open-source y gratuita de Adobe. No es pesada para los ojos y diferencia claramente los caracteres. Para descargar la fuente, pueden visitar su
[Github](https://github.com/adobe-fonts/Source-Code-Pro).

{% highlight json %}
"font_face": "Source Code Pro Medium",
"font_options": ["bold"],
"font_size": 8.3,
{% endhighlight %}

`color-scheme` y `theme` - Aunque el color scheme por defecto (Monokai) no esta nada mal, yo prefiero unos colores mas apagados. Mi **color scheme** favorito ahora mismo es el [**Dracula**](http://zenorocha.github.io/dracula-theme/) que se puede descargar desde el propio Package Control. De **tema** utilizo el famoso [**Soda**](https://packagecontrol.io/packages/Theme%20-%20Soda) en su versión dark. También hay otros muy interesantes como [Fox](https://packagecontrol.io/packages/Theme%20-%20Fox) que imita el diseño del Firefox Developer Edition.

{% highlight json %}
"theme": "Soda Dark 3.sublime-theme",
"color_scheme": "Packages/Dracula Color Scheme/Dracula.tmTheme",
{% endhighlight %}


`fold-buttons` y `fade_fold_buttons` -  Fold buttons es un triangulo pequeño que te permite &ldquo;esconder&#8221; parte del código para centrarte en otra cosa. Es una opción muy popular en los IDE's y yo la recomiendo bastante. _fade_fold_buttons_ escodendera esos triángulos hasta que no pases el cursor por encima. A mi personalmente no me agrada así que suelo dejarlo activado y visible todo el tiempo.

{% highlight json %}
"fold_buttons": true,
"fade_fold_buttons": false,
{% endhighlight %}

`tab_size`, `translate_tabs_to_spaces` y `use_tab_stops` - Personalmente no me gustan los tabs (el margen que se crea al indentar), este tema esta muy discutido y para gustos, colores, pero yo por lo menos prefiero espacios (4).

{% highlight json %}
"tab_size": 4,
"translate_tabs_to_spaces": true,
"use_tab_stops": true,
{% endhighlight %}

`highlight_line` y `highlight_modified_tabs` - Estas opciones &ldquo;marcaran&#8221; la linea en la que estamos actualmente y si el tab has sido modificado pero no guardado. Algo bastante útil =).

{% highlight json %}
"highlight_line": true,
"highlight_modified_tabs": true,
{% endhighlight %}

`always_show_minimap_viewport` y `draw_minimap_border` - El viewport es el cuadrado en el minimapa que mas o menos nos indica donde estamos. Por defecto aparece solo cuando pasamos el cursor por encima.. pero por supuesto podemos forzarle. Draw minimap border es el borde que se dibuja alrededor del mapa...

{% highlight json %}
"always_show_minimap_viewport": true,
"draw_minimap_border": false,
{% endhighlight %}


Estas son las cosas mas básicas aunque siempre hay algunos detalles. Yo suelo tener mi config en Git para que pueda clonarlo cada vez que me haga falta sin tener que re-configurar todo.

___

## Extensiones <a name='Extensiones'></a>

Bien, llegamos a la parte divertida. Por supuesto, estas "extensiones" siempre se pueden instalar desde el Package Control pulsado **CTRL + Shift + P**, escribiendo **install** _{ENTER}_, el nombre de la extensión y _{ENTER}_.


### - ApacheConf.tmLanguage ([link](https://packagecontrol.io/packages/ApacheConf.tmLanguage))
Para los que usamos _Apache_ y nos toca lidiar con sus archivos de configuración esta extensión es perfecta pues añade soporte para colorear lineas. Una vez instalado se puede seleccionar desde el seleccionador de sintaxis o escribiendo **ss apache** en el menú.


### - Emmet ([link](https://packagecontrol.io/packages/Emmet))
Como siempre, un plugin indispensable para cualquiera que aprecie su tiempo y su workflow. _Emmet_ convierte sintaxis cortas en largas. Un simple ejemplo podría ser escribir:

    ul>li*5

Pulsar _{tab}_ y ver el resultado.

    <ul>
       <li></li>
       <li></li>
       <li></li>
       <li></li>
       <li></li>
    </ul>

En [este enlace](http://docs.emmet.io/cheat-sheet/), podéis encontrar un cheatsheet muy bueno explicando en detalle los shortcuts.


### - ColorPicker ([link](https://packagecontrol.io/packages/ColorPicker))
En la versión 2 y a principios de la versión 3 había varios plugins para facilitar la tarea de escoger un color. Ahora mismo hay solo uno y se llama ColorPicker. Su función es bastante sencilla, te permite seleccionar un color de manera gráfica usando el &ldquo;color-picker&#8221; del sistema. En GNU/Linux esta algo buggeado ya que no te permite enfocar la ventana de Sublime mientras esta abierto, pero hace su trabajo.


### - HTMLAtributes ([link](https://packagecontrol.io/packages/HTMLAttributes))
Completado automático para atributos de HTML/HTML5. La verdad no hay mucho que decir.. es un pequeño complemento para acelerar nuestro workflow.


### - HTML5 ([link](https://packagecontrol.io/packages/HTML5))
Añade soporte de sintaxis para HTML5 (colorear) y varios snippets.


### - +Nettuts Fetch ([link](https://packagecontrol.io/packages/Nettuts%2B%20Fetch))
Este plugin sirve para obtener el contenido de archivos remotos (e incluso proyectos enteros). Es muy útil por ejemplo para cuando queramos descargar jQuery o algún archivo CSS. Una vez instalado, **CTRL + SHIFT + P** y elegir **Fetch: Manage**. Desde ahí se pueden configurar los archivos y sus accesos directos.


### - jQuery Snippets Pack ([link](https://packagecontrol.io/packages/jQuery%20Snippets%20pack))
Muy útil para los que trabajamos con jQuery. Añade unos cuantos snippets. Por ejemplo al escribir `$ready` y pulsar _{TAB}_. Se convertirá automáticamente en:

    $(function () { });


### - DocBlockr ([link](https://packagecontrol.io/packages/DocBlockr))
Simplifica la tarea de documentar (mediante comentarios) el codigo. Actualmente tiene soporte para JavaScript, PHP, CoffeeScript, ActionScript y C/C++.


### - AutoFileName ([link](https://packagecontrol.io/packages/AutoFileName))
Auto-completado para archivos. Muy útil para no distraerse buscando las rutas de los archivos y sus respectivos nombres.

___

## Tips y Workflow <a name='Workflow'></a>

Algunos trucos y consejos para mejorar el workflow.

**- Ir a linea** - Al pulsar **Alt + G** y escribir un numero, ST nos llevara directamente a la linea que le hemos indicado.

**- Navegar/Editar archivos**  - Usando **Ctrl + P** ST nos mostrara una lista de archivos. Podemos navegar por directorios escribiendo rutas relativas y pulsar **Enter** para abrir el archivo seleccionado.

**- Ir a un metodo** - Si pulsamos **Ctrl + R**, podemos indicarle a ST un nombre de metodo/id para que nos lleve directamente a el.

**- Ocultar/Mostrar la barra de menú y barra literal** - Muy útil para una vista minimalista, podemos hacer toggle a la barra del menú y a la barra lateral indicando un par de Key Bindigs.

Ir a: **Preferences**, **Key Bindings - User** y añadir las siguientes lineas.

    { "keys": ["f12"], "command": "toggle_menu"},
    { "keys": ["ctrl+b"], "command": "toggle_side_bar"},

Ahora, con **F12** podremos Ocultar/Mostrar la barra del menú y con **Ctrl + B** la barra lateral.


Saludos


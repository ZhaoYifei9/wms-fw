<?php
/**
 * @author Dawnc
 * @date   2020-12-08
 */

$dir = dirname(dirname(dirname(__DIR__)));
require $dir . "/vendor/autoload.php";

require dirname(dirname(__DIR__)) . "/vendor/autoload.php";


use Wms\Fw\Conf;
use Wms\Fw\Fw;

$GLOBALS['REQUEST_METHOD'] = strtoupper($_SERVER['REQUEST_METHOD']);

define("APP_PATH", dirname(__DIR__));

Conf::set('app', include APP_PATH . "/Conf/app.conf.php");
Conf::set('route', include APP_PATH . "/Conf/route.conf.php");
$fw = new Fw();
$fw->run();


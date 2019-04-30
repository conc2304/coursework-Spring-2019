<?php

$url = $_SERVER['REQUEST_URI'];
$q = parse_url($url, PHP_URL_QUERY);

if (!$q) {
  $q = 'i';
}

$constitution = array(
  'i'          => array(
    'title' => 'Article I',
    'link'  => 'i.php',
  ),
  'ii'         => array(
    'title' => 'Article II',
    'link'  => 'ii.php',
  ),
  'iii'        => array(
    'title' => 'Article III',
    'link'  => 'iii.php',
  ),
  'iv'         => array(
    'title' => 'Article IV',
    'link'  => 'iv.php',
  ),
  'v'          => array(
    'title' => 'Article V',
    'link'  => 'v.php',
  ),
  'vi'         => array(
    'title' => 'Article VI',
    'link'  => 'vi.php',
  ),
  'vii'        => array(
    'title' => 'Article VII',
    'link'  => 'vii.php',
  ),
  'amendments' => array(
    'title' => 'Amendements',
    'link'  => 'amendments.php',
  ),
);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>The United States Constitution: Article I</title>
  <?php include("includes/htmlhead.php"); ?>
</head>

<body>
<div class="container">
  <?php include("includes/header.php"); ?>
  <div class="row">
    <?php include("includes/navigation.php"); ?>
    <?php include($constitution[$q]['link']); ?>
  </div>

  <?php include("includes/footer.php"); ?>

</div>
</body>



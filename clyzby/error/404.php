<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - Page Not Found</title>
  <?php include('../../clyzby/files/@custom/includes/head.php'); ?>
</head>
<body>

<div id="page">
  <?php include('../../clyzby/files/@custom/includes/navigation.php'); ?>
  <div class="sketch-container"></div>
  <?php include('../../clyzby/files/@custom/includes/footer.php'); ?>
</div>
</body>
</html>


<style>
  #sketch-container {
    width: 100%;
    height: 100%;
  }

  #sketch-container canvas#defaultCanvas0 {
    width: 100% !important;
    height: 100% !important;
  }
</style>


<script src="/clyzby/p5js/js/libraries/p5.js"></script>
<script src="/clyzby/p5js/js/src/404Sketch.js"></script>
<div class="three columns">
  <nav>
    <ul>
      <?php
      if (isset($constitution) && is_array($constitution)) {
        foreach ($constitution as $key => $value) {
          $here = false;
          if ($key == $q) {
            $here = true;
          }
      ?>
      <li <?php print ($here) ? 'id="iamhere" ' : ''; ?>><a href="index.php?<?php print $key; ?>"><?php print $value['title']; ?></a></li>
      <?php
        }
      }
      ?>
    </ul>
  </nav>
</div>
import type { Component } from "solid-js";

import styles from "./NavBar.module.css";

const NavBar: Component = () => {
  return (
    <div class={styles.NavBar}>
      <ul class={styles.NavBarList}>
        <li class={styles.NavBarListItem}><span class="material-icons">home</span></li>
        <li class={styles.NavBarListItem}>video-trim</li>
      </ul>
    </div>
  );
};

export default NavBar;

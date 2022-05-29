import type { Component } from "solid-js";

import styles from "./NavBar.module.scss";

const NavBar: Component = () => {
  return (
    <nav class={styles.NavBar}>
      <span class="material-icons">home</span>
      <ul class={styles.NavBarList}>
        <li class={styles.NavBarListItem}>video-trim</li>
      </ul>
    </nav>
  );
};

export default NavBar;

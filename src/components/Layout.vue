<template>
  <div class="root">
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
      <footer class="logo-container">
        <img src="~@/images/logo.png">
      </footer>
    </main>
  </div>
</template>

<style lang="scss">
@media (prefers-color-scheme: dark) {
  html, body, nav {
    background: #1f1f1f !important;
    color: #bfbfbf;
  }
  nav.bg-light {
    background: #262626 !important;
  }
  a.nav-link:hover {
    color: rgba(191, 191, 191, 0.7) !important;
  }
  .nav-link.router-link-active {
    color: #fff  !important;
  }
  .navbar-brand, .nav-link {
    color: #bfbfbf !important;
  }
  .card-body {
    background: #262626 !important;
  }
  .card {
    border-color: #000 !important;
  }
  .custom-switch .custom-control-label::before {
    background: #262626 !important;
    border-color: #616161;
  }
  .card-title a {
    color: #99bee6;
  }
  .form-control, .form-control:focus {
    background: transparent;
    border-color: #3b454e;
    color: #babfc5;
  }
  .dropdown-menu, .dropdown-menu a {
    background: #1f1f1f !important;
    color: #bfbfbf;
  }
  .table-hover tbody tr:hover {
    color: #fff;
  }
  .table {
    background: #1f1f1f !important;
    color: #bfbfbf;
    td a {
      color: #99bee6;
    }
    tr, td, th {
      border-color: #363636;
    }
    thead th {
      border-color: #363636;
    }
  }
  .dropdown-menu a:hover {
    color: #99bee6;
  }
  .swal-modal {
    background: #1f1f1f;
  }
  .swal-text {
    color: rgba(191, 191, 191, 0.64);
  }
  .swal-button {
    &--confirm {
      &:not([disabled]):hover {
        background: #28799f;
        color: #fff;
      }
      background: #267397;
      color: #fff
    }
    &--cancel {
      &:not([disabled]):hover {
        background: #303030;
        color: #fff;
      }
      background: #292929;
      color: #fff
    }
  }
  .modal-header, .modal-body {
    background: #1f1f1f;
    color: #bfbfbf;
    border-color: #363636;
  }
  .close:hover {
    color: #bfbfbf;
    opacity: .75;
  }
  button.close {
    &:not(:disabled):not(.disabled):focus, .close:not(:disabled):not(.disabled):hover {
      color: #bfbfbf;
      opacity: .75;
    }
    color: #bfbfbf;
    text-shadow: none;
  }
}
footer {
  & img {
    width: 100px;
  }
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>

<script>
export default {
  name: 'Layout'
}
</script>

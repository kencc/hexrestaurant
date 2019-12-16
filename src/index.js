// 載入 Sass 文件
import './scss/all.scss';


$(document).ready(function () {
  $('.navbar-toggler').click(function (e) { 
    e.preventDefault();
    $('body').toggleClass('show-menu');
  });
});
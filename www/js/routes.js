"use strict";
var routes = [
  // Index page
  {
      path: '/',
      url: './index.html',
      name: 'home',
  },
  //Scan
    {
        path: '/giftcard/',
        url: './pages/giftcard.html',
        name: 'giftcardzz',
    },
  // Login
    {
        path: '/login_new/',
        url: './pages/login_new.html',
        name: 'login_new',
    },
  // Default route (404 page). MUST BE THE LAST
  {
      path: '(.*)',
      url: './pages/404.html',
  },
];

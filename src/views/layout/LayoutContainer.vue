<template>
  <router-view></router-view>
  <van-tabbar route>
    <van-tabbar-item replace to="/home" icon="wap-home"></van-tabbar-item>
    <van-tabbar-item replace to="/user-list" icon="friends"></van-tabbar-item>
    <van-tabbar-item replace to="/share" icon="cluster"></van-tabbar-item>
    <van-tabbar-item
      replace
      to="/notif"
      icon="bell"
      :badge-props="{
        content: 0,
        dot: false,
        max: 9,
        color: '#1989fa'
      }"
    ></van-tabbar-item>
    <van-tabbar-item replace to="/post" icon="comment"></van-tabbar-item>
  </van-tabbar>
</template>

import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../ldustu-ele-admin/layout'

Vue.use(VueRouter)

/**
 * constantRoutes
 * 没有权限要求的基础页面
 * 所有角色都可查看
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    meta: { title: '首页', icon: 'el-icon-s-help' },
  },

  {
    path: '/base',
    component: Layout,
    redirect: '/base/list',
    name: 'Base',
    meta: { title: '基础页面', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'BaseList',
        component: () => import('@/views/base/list'),
        meta: { title: '列表页', icon: 'list' }
      },
      {
        path: 'form',
        name: 'BaseForm',
        component: () => import('@/views/base/form'),
        meta: { title: '表单页', icon: 'tree' }
      }
    ]
  },

  // 404 页面必须写在最后
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * 需要权限的页面
 */
export const asyncRoutes = [
  {
    path: '/flow',
    component: Layout,
    redirect: '/flow/table',
    name: 'Flow',
    meta: { title: '业务流程', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'FlowTable',
        component: () => import('@/views/flow/table'),
        meta: { title: '表格页', icon: 'table' }
      },
      {
        path: 'form',
        name: 'FlowForm',
        component: () => import('@/views/flow/form'),
        meta: { title: '表单页', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'FlowDetail',
        component: () => import('@/views/flow/detail'),
        meta: { title: '详情页', icon: 'tree' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

export default router

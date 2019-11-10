import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { Link } from 'react-router-dom'
import { urlToList } from '@/utils'

// 渲染Breadcrumb 子节点
// Render the Breadcrumb child node
const itemRender = (route: any, params: any, routes: any, paths: any) => {
  const last = routes.indexOf(route) === routes.length - 1
  // if path is home, use Link。
  if (route.path === '/') {
    return <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  }
  return last || !route.component ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  )
}

const renderItemLocal = (item: any) => {
  return item.name
}

export const getBreadcrumb = (breadcrumbNameMap: any, url: string) => {
  let breadcrumb = breadcrumbNameMap[url]
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item]
      }
    })
  }
  return breadcrumb || {}
}

export const getBreadcrumbProps = (props: any) => {
  const { routes, params, location, breadcrumbNameMap } = props
  return {
    routes,
    params,
    routerLocation: location,
    breadcrumbNameMap
  }
}

const conversionFromProps = (props: any) => {
  const { breadcrumbList } = props
  return breadcrumbList.map((item: any) => {
    const { title, href } = item
    return {
      path: href,
      breadcrumbName: title
    }
  })
}

const conversionFromLocation = (routerLocation: any, breadcrumbNameMap: any, props: any) => {
  const { home } = props
  // Convert the url to an array
  const pathSnippets = urlToList(routerLocation.pathname)
  // Loop data mosaic routing
  const extraBreadcrumbItems = pathSnippets
    .map(url => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url)
      if (currentBreadcrumb.inherited) {
        return null
      }
      const name = renderItemLocal(currentBreadcrumb)
      const { hideInBreadcrumb } = currentBreadcrumb
      return name && !hideInBreadcrumb
        ? {
          path: url,
          breadcrumbName: name
        }
        : null
    })
    .filter(item => item !== null)
  // Add home breadcrumbs to your head if defined
  if (home) {
    extraBreadcrumbItems.unshift({
      path: '/',
      breadcrumbName: home
    })
  }
  return extraBreadcrumbItems
}

/**
 * 将参数转化为面包屑
 * Convert parameters into breadcrumbs
 */
export const conversionBreadcrumbList = (props: any) => {
  const { breadcrumbList } = props
  const { routes, params, routerLocation, breadcrumbNameMap } = getBreadcrumbProps(props)
  if (breadcrumbList && breadcrumbList.length) {
    return {
      routes: conversionFromProps(props),
      params,
      itemRender
    }
  }
  // 如果传入 routes 和 params 属性
  // If pass routes and params attributes
  if (routes && params) {
    return {
      routes: routes.filter((route: any) => route.breadcrumbName),
      params,
      itemRender
    }
  }
  // 根据 location 生成 面包屑
  // Generate breadcrumbs based on location
  if (routerLocation && routerLocation.pathname) {
    return {
      routes: conversionFromLocation(routerLocation, breadcrumbNameMap, props),
      itemRender
    }
  }
  return {}
}

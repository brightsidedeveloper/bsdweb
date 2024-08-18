import { Children, cloneElement, isValidElement } from 'react'

export default function childrenWithProps<T extends { [key: string]: unknown }>(children: React.ReactNode, props: T) {
  return Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { ...props })
    }
    return child
  })
}

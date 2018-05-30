import React, { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import styles from './index.less'

class EditableLinkGroup extends PureComponent {
  static defaultProps = {
    links: [],
    onAdd: () => {},
    linkElement: 'a',
  }
  static propTypes = {
    links: PropTypes.array,
    onAdd: PropTypes.func,
    linkElement: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }

  render () {
    let {links, onAdd, linkElement} = this.props
    return (
      <div className={styles.linkGroup}>
        {
          links.map(link =>
            createElement(
              linkElement,
              {
                key: `linkGroup-item-${link.id || link.title}`,
                to: link.href,
                href: link.href,
              },
              link.title,
            ),
          )
        }
        {
          <Button size="small" type="primary" ghost onClick={onAdd} icon="plus">
            添加
          </Button>
        }
      </div>
    )
  }
}

export default EditableLinkGroup
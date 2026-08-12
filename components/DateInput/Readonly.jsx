import PropTypes from 'prop-types'
import classnames from 'classnames'

import { toQaId } from '../../util/formats'

const Readonly = ({ 'data-qa-id': dataQaId, className, style, children, ...props }) => {
  const qaId = toQaId({
    parentId: dataQaId,
    componentId: 'Readonly',
  })

  return (
    <span data-qa-id={qaId} className={classnames({ [className]: className })} style={{ ...style }} {...props}>
      {children}
    </span>
  )
}

Readonly.propTypes = {
  'data-qa-id': PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Readonly

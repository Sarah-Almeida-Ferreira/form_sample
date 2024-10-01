import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config } from '@vue/test-utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark, faPencil, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

library.add(faXmark, faPencil, faCaretDown, faCaretUp)

config.global.components['font-awesome-icon'] = FontAwesomeIcon

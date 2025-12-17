import './styles/style.css'

import { initPageTransitions } from './animations/pageTransitions.js'
import { reloadOnViewportChange } from './utils/animationUtils.js'

reloadOnViewportChange()
initPageTransitions()

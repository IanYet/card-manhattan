import './index.css'
import { main } from './src/app'
import { net } from './src/net'


net.setUrl('http://localhost:3000/')
net.setKey('123')
main()
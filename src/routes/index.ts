import express from 'express'

import authRoute from './auth'
import bookRoute from './book'
import commentRoute from './comment'
import departmentRoute from './departments'
import homeRoute from './home'
import issueRoute from './issues'
import wishlistRoute from './wishlist'

const router = express.Router()

router.use('/', homeRoute)
router.use('/auth', authRoute)
router.use('/department', departmentRoute)
router.use('/book', bookRoute)
router.use('/issue', issueRoute)
router.use('/comment', commentRoute)
router.use('/wishlist', wishlistRoute)

export default router

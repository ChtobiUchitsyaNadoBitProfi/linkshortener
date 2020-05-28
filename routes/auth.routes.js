const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
	'/register', 
	[
		check('email', 'Некорpектный email').IsEmail(),
		check('password', 'Минимальная длинна пароля 6 шесть символов')
			.isLength( { min: 6 } )
	]
	async (reg, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Некорpектные данные при регистрации'
			})
		}

		const {email, password} = req.body

		const candidate = await User.findOne({ email })

		if (candidate) {
			return res.status(400).json({message: 'Такой пользователь уже существует'})
		}

		const hashedPassword = await bcrypt.hash(password, 12)
		const user = new User({email, password: hashedPassword })

		await user.save()

		res.status(201).json({ message: 'Пользователь сохранен'})

	} catch (e) {
		res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
	}
})

router.post('/rlogin', async (reg, res) => {

})

module.exports = router
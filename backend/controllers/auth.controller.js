const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET } = require('../middlewares/authenticate');

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, type: 'refresh' }, SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula';
  if (!/[a-z]/.test(password)) return 'La contraseña debe tener al menos una minúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número';
  return null;
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email y password son requeridos' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'El formato del email no es válido' });
    }
    const pwError = validatePassword(password);
    if (pwError) {
      return res.status(400).json({ error: pwError });
    }
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await User.create({ name, email, password: hashed });
    const token = generateAccessToken({ id, name, email });
    const refreshToken = generateRefreshToken({ id });

    res.status(201).json({ token, refreshToken, user: { id, name, email, onboarding_completed: 0, photo_url: null } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ token, refreshToken, user: { id: user.id, name: user.name, email: user.email, onboarding_completed: user.onboarding_completed, photo_url: user.photo_url || null } });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });
    try {
      const decoded = jwt.verify(refreshToken, SECRET);
      if (decoded.type !== 'refresh') return res.status(401).json({ error: 'Token inválido' });
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
      const token = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.json({ token, refreshToken: newRefreshToken });
    } catch {
      return res.status(401).json({ error: 'Token expirado o inválido' });
    }
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.completeOnboarding = async (req, res, next) => {
  try {
    await User.update(req.user.id, { onboarding_completed: 1 });
    res.json({ message: 'Onboarding completado' });
  } catch (err) { next(err); }
};

exports.resetOnboarding = async (req, res, next) => {
  try {
    await User.update(req.user.id, { onboarding_completed: 0 });
    res.json({ message: 'Onboarding reiniciado' });
  } catch (err) { next(err); }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });
    const photoUrl = `/uploads/${req.file.filename}`;
    await User.update(req.user.id, { photo_url: photoUrl });
    const user = await User.findById(req.user.id);
    res.json({ photo_url: photoUrl, user });
  } catch (err) { next(err); }
};

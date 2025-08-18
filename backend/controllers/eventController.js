const EventModel = require('../models/eventModel');

exports.createEvent = async (req, res) => {
  const { user_id, event_date, event_name, event_description, repetition } = req.body;

  if (!user_id || !event_date || !event_name)
    return res.status(400).json({ message: 'user_id, event_date, event_name required' });

  try {
    const id = await EventModel.create({ user_id, event_date, event_name, event_description, repetition });
    res.status(201).json({ message: 'Event created', event_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await EventModel.getAll(req.query);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updated = await EventModel.update(req.params.id, req.body);
    if (!updated) return res.status(400).json({ message: 'No fields to update' });
    res.json({ message: 'Event updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await EventModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

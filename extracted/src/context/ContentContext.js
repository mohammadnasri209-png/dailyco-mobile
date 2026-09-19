// src/context/ContentContext.js — pulls admin-editable text (login subtitle,
// support note, etc.) so the app never has to be redeployed just to fix a
// typo or reword something.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ContentAPI } from '../api/client';

const DEFAULTS = {
  'login.title': 'Dailyco',
  'login.subtitle': 'یادگیری روزانه زبان انگلیسی 🎓',
  'home.welcome_prefix': 'سلام',
  'support.contact_note': 'تیم پشتیبانی معمولاً ظرف چند ساعت پاسخ می‌ده.',
  'lesson.empty_state': 'واژه‌ای برای امروز پیدا نشد 🙁',
};

const ContentContext = createContext({ get: (key) => DEFAULTS[key] || '', reload: () => {} });

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULTS);

  const reload = async () => {
    try {
      const remote = await ContentAPI.all();
      setContent({ ...DEFAULTS, ...remote });
    } catch (e) {
      // Offline or backend unreachable — defaults already cover every key.
    }
  };

  useEffect(() => { reload(); }, []);

  const get = (key) => content[key] ?? DEFAULTS[key] ?? '';

  return <ContentContext.Provider value={{ get, reload }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

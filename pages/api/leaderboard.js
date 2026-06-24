import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Inside the POST method
    const { username, score, time } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from('scores')
      .select('id, score, time')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      // Logic: Update if score is higher, OR if score is same but time is faster
      if (score > existing.score || (score === existing.score && time < existing.time)) {
        await supabase
          .from('scores')
          .update({ score, time })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('scores').insert({ username, score, time });
    }

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  // GET remains the same
  else {
    const { data, error } = await supabase
      .from('scores')
      .select('username, score, time')
      .order('score', { ascending: false }) // Primary Sort: Distance (High to Low)
      .order('time', { ascending: true })   // Secondary Sort: Time (Low to High)
      .limit(10);
    return res.status(200).json(data || []);
  }
}
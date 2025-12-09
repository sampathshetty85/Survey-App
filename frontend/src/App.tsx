import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('5');
  const [comments, setComments] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('Submitting...');

    const payload = { name, email, rating: parseInt(rating, 10), comments };

    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      const json = await res.json();
      setMsg('Thanks! Submission saved (id: ' + (json.id ?? 'n/a') + ').');
      setName('');
      setEmail('');
      setRating('5');
      setComments('');
    } catch (err) {
      console.error(err);
      setMsg('Submission failed.');
    } finally {
      setLoading(false);
    }
  }

  const [nameSaved, setNameSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [ratingSaved, setRatingSaved] = useState(false);
  const [commentsSaved, setCommentsSaved] = useState(false);

  function doGo(type: 'name'|'email'|'rating'|'comments'){
    // small local confirmation; does not submit to backend
    if(type==='name'){ setNameSaved(true); setTimeout(()=>setNameSaved(false),1500); }
    if(type==='email'){ setEmailSaved(true); setTimeout(()=>setEmailSaved(false),1500); }
    if(type==='rating'){ setRatingSaved(true); setTimeout(()=>setRatingSaved(false),1500); }
    if(type==='comments'){ setCommentsSaved(true); setTimeout(()=>setCommentsSaved(false),1500); }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="banner">
          <div className="container">
            <h1>Survey App</h1>
            <div>Tell us what you think</div>
          </div>
        </div>

        <div className="content">
          <div className="survey-form">
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <label htmlFor="name">Name</label>
                <div className="field-input-row">
                  <input id="name" value={name} onChange={(e)=>setName(e.target.value)} required />
                  <button type="button" className="go-button" onClick={()=>doGo('name')}>Go</button>
                  {nameSaved && <span className="field-saved">Saved</span>}
                </div>
              </div>

              <div className="field-row">
                <label htmlFor="email">Email</label>
                <div className="field-input-row">
                  <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />
                  <button type="button" className="go-button" onClick={()=>doGo('email')}>Go</button>
                  {emailSaved && <span className="field-saved">Saved</span>}
                </div>
              </div>

              <div className="field-row">
                <label htmlFor="rating">Rating</label>
                <div className="field-input-row">
                  <select id="rating" value={rating} onChange={(e)=>setRating(e.target.value)}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Okay</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Very poor</option>
                  </select>
                  <button type="button" className="go-button" onClick={()=>doGo('rating')}>Go</button>
                  {ratingSaved && <span className="field-saved">Saved</span>}
                </div>
              </div>

              <div className="field-row">
                <label htmlFor="comments">Comments</label>
                <div className="field-input-row">
                  <textarea id="comments" value={comments} onChange={(e)=>setComments(e.target.value)} rows={4} />
                  <button type="button" className="go-button" onClick={()=>doGo('comments')}>Go</button>
                  {commentsSaved && <span className="field-saved">Saved</span>}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                <span style={{ marginLeft: 12 }}>{msg}</span>
              </div>
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

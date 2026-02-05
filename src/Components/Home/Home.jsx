import React, { useContext, useEffect, useState } from 'react'
import { noteContext } from '../../Context/noteContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [note, setNote] = useState({ title: "", content: "" });
  const [allNotes, setAllNotes] = useState(null); 
  const { addNotes, getallUserNotes, deleteNote, updateNote } = useContext(noteContext); 
  
  const [id, setId] = useState(localStorage.getItem('myId')); 
  const userToken = localStorage.getItem('userToken');

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false); 
  const [currentNoteId, setCurrentNoteId] = useState(null);

  useEffect(() => { 
    if (userToken) {
        handlegetallUserNotes(); 
    }
  }, [userToken])

async function handlegetallUserNotes() {
    let res = await getallUserNotes();
    
    if (res && res.data && res.data.notes) {
      setAllNotes(res.data.notes);
    } else {
      setAllNotes([]);
    }
  }
 async function handleSubmit(e) {
    e.preventDefault();
    async function handleSubmit(e) {
    e.preventDefault();
   
}
    if (!note.title || !note.content) return toast.error("Fields are required");
    const loadingToast = toast.loading(isEdit ? 'Updating...' : 'Saving...');
    try {
      let response = isEdit ? await updateNote(currentNoteId, note) : await addNotes(note);
      
      if (response?.data?.msg === "done") {
        toast.success(isEdit ? 'Updated!' : 'Added!', { id: loadingToast });
        closeModal();
        handlegetallUserNotes(); 
      }
    } catch (error) { toast.error('Error', { id: loadingToast }); }
  }

  async function handleDelete(noteId) {
    const loadingToast = toast.loading('Deleting...');
    try {
      let res = await deleteNote(noteId);
      if (res?.data?.msg === "done") {
        toast.success('Deleted!', { id: loadingToast });
        handlegetallUserNotes();
      }
    } catch (error) { toast.error('Failed', { id: loadingToast }); }
  }

  function openViewModal(noteItem) {
    setNote({ title: noteItem.title, content: noteItem.content });
    setIsView(true);
    setIsEdit(false);
    setIsOpen(true);
  }

  function openEditModal(e, noteItem) {
    e.stopPropagation(); 
    setNote({ title: noteItem.title, content: noteItem.content });
    setCurrentNoteId(noteItem.id);
    setIsEdit(true);
    setIsView(false);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setIsEdit(false);
    setIsView(false);
    setNote({ title: "", content: "" });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-10">
      <Toaster position="top-center" />
      
      <button 
        onClick={() => { setIsEdit(false); setIsView(false); setNote({title:"", content:""}); setIsOpen(true); }}
        className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-[#38b29b] text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center group"
      >
        <i className="fa-solid fa-plus text-2xl group-hover:rotate-90 transition-transform"></i>
      </button>

      <div className="container mx-auto px-10 md:px-20 lg:px-32 pt-16 max-w-[1400px]">
        
        <header className="mb-14">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Recent <span className="text-[#38b29b]">Notes</span></h2>
            <p className="text-gray-400 text-sm mt-2">Manage your thoughts and ideas effortlessly.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {allNotes === null ? (
            <div className="col-span-full text-center py-20 text-gray-300 animate-pulse text-2xl font-bold">Loading your notes...</div>
          ) : (
            
            allNotes.length > 0 ? (
              allNotes.map((noteItem) => (
                <div 
                  key={noteItem.id} 
                  onClick={() => openViewModal(noteItem)} 
                  className="bg-white rounded-[2.5rem] p-9 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="font-bold text-gray-800 text-xl line-clamp-1">{noteItem.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => openEditModal(e, noteItem)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><i className="fa-solid fa-pen text-xs"></i></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(noteItem.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><i className="fa-solid fa-trash text-xs"></i></button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm italic leading-relaxed line-clamp-4 min-h-[80px]">"{noteItem.content}"</p>
                  <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                     <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                       {new Date(noteItem.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                     </span>
                     <i className="fa-solid fa-bookmark text-[#38b29b]/20"></i>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full text-center py-40 text-gray-400">
                  <i className="fa-regular fa-face-smile text-7xl mb-6 block text-gray-200"></i>
                  <p className="text-xl font-medium">No notes here yet. Click the + to start!</p>
               </div>
            )
          )}
        </div>
      </div>

      {/* المودال */}
      {isOpen && ( 
        <div onClick={closeModal} className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/50 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-[#38b29b] p-10 text-white flex justify-between items-center">
                <h3 className="text-3xl font-black">{isView ? 'Reading' : (isEdit ? 'Update' : 'New')}</h3>
                <button onClick={closeModal} className="text-white/60 hover:text-white transition-colors"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
            </div>

            {isView ? (
              <div className="p-10 space-y-6">
                <h4 className="text-2xl font-bold text-gray-900">{note.title}</h4>
                <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
                <button onClick={() => setIsView(false) || setIsEdit(true)} className="w-full py-4 mt-6 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all">Edit this note</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <input value={note.title} onChange={(e)=>setNote({...note, title:e.target.value})} type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#38b29b]/20 transition-all text-lg" placeholder="Title" />
                <textarea value={note.content} onChange={(e)=>setNote({...note, content:e.target.value})} rows="5" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#38b29b]/20 transition-all resize-none text-lg" placeholder="Content"></textarea>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-[2] py-4 bg-[#38b29b] text-white font-bold rounded-2xl shadow-lg hover:bg-[#2f9683] transition-all">
                    {isEdit ? 'Save Changes' : 'Create Note'}
                  </button>
                  <button type="button" onClick={closeModal} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
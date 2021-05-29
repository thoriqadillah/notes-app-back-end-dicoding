const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    //titel, tags, dan body merupakan data yang akan disimpan ke dalam bentuk JSON dari http://notesapp-v1.dicodingacademy.com/notes/new
    //dibawah ini merupakan properti data yang akan disimpan dalam bentuk array. jika menggunakan database, maka ini adalah field yang ada pada databse

    const { title, tags, body } = request.payload; //request.payload berguna untuk mendapatkan body request 

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = { title, tags, body, id, createdAt, updatedAt };

    notes.push(newNote);

    //untuk menentukan apakah newNote sudah masuk ke dalam array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahakan',
            data: {
                noteId: id
            }
        });
        response.code(201);

        return response;
    }
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params; //id dari request (di path parameternya). 
    // kalo di php jadinya $var (nama terserah) = $_POST['id']

    //karena hasil return filter adalah array, maka penggunaan [0] digunakan untuk menspesifikkan array index ke 0. Semisal kita ingin mengambil ide yang dikirim pada path parameter, cukup hapus [0] nya
    //penjalasan lebih lanjut ada di https://www.dicoding.com/academies/261/discussions/97754
    const note = notes.filter(n => n.id === id)[0];
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note
            }
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    });
    response.code(404);

    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    //mencari index pada objek notes yang akan diubah
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        //The splice() method adds/removes items to/from an array, and returns the removed item(s)
        //lebih lanjut ada di https://www.w3schools.com/jsref/jsref_splice.asp
        notes.splice(index, 1);
        
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler
};
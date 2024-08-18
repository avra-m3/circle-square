import {
    get,
    getDatabase,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    ref,
    remove,
    set,
    update,
    goOffline
} from '@firebase/database';
import { CustomCircle, CustomRect } from '@/components/canvas/Shapes';
import { app } from '@/components/firebase/app';

export const connect = () => {
    return getDatabase(app)
}

export const disconnect = () => {
    goOffline(connect());
}

export const getAllObjects = async () => {
    const dataRef = ref(connect(), 'objects');
    const snapshot = await get(dataRef);
    return snapshot.val();
}

export const listenForUpdates = (callback: (type: 'add' | 'update' | 'delete', key: string, value: unknown) => void) => {
    const dataRef = ref(connect(), 'objects');
    onChildAdded(dataRef, (snapshot) => {
        const data = snapshot.val();
        callback('add', snapshot.key as string, data);
    })
    onChildChanged(dataRef, (snapshot) => {
        const data = snapshot.val();
        callback('update', snapshot.key as string, data);
    })
    onChildRemoved(dataRef, (snapshot) => {
        const data = snapshot.val();
        callback('delete', snapshot.key as string, data);
    })
}

export const updateShapeInDb = async (elem: CustomCircle | CustomRect) => {
    const rep = elem.toDbRep();
    await update(ref(connect(), 'objects/' + elem.get('id')), rep);
}

export const writeNewShapeToDb = async (elem: CustomCircle | CustomRect) => {
    // Avoid creating shapes that already exist.
    if (elem.get('loaded') || !elem.get('id')) {
        return;
    }
    const rep = elem.toDbRep();
    await set(ref(connect(), 'objects/' + elem.get('id')), rep);
    elem.set('loaded', true)
}

export const deleteShapeFromDb = async (elem: CustomCircle | CustomRect) => {
    if (elem.get('id') && elem.get('final') !== false) {
        console.log('sending delete to server')
        await remove(ref(connect(), 'objects/' + elem.get('id')));
        elem.set('final', undefined);
    }
}
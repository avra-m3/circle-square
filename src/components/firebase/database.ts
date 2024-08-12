import {
    get,
    getDatabase,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    ref,
    remove,
    set,
    update
} from '@firebase/database';
import { CustomCircle, CustomRect } from '@/components/canvas/Shapes';
import { app } from '@/components/firebase/app';

export const connect = () => {
    return getDatabase(app)
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
    if (elem.get('loaded')) {
        return;
    }
    const rep = elem.toDbRep();
    await set(ref(connect(), 'objects/' + elem.get('id')), rep);
}

export const deleteShapeFromDb = async (elem: CustomCircle | CustomRect) => {
    if (elem.get('id')) {
        await remove(ref(connect(), 'objects/' + elem.get('id')));
    }
}
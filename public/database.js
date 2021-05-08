let database;
const openDB = indexedDB.open('budget', 1);

openDB.onupgradeneeded = function(event) {
  const database = event.target.result;
  database.createObjectStore('pending', { autoIncrement: true });
  /*const transaction = database.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore("pending");
  store.clear();*/
};

openDB.onsuccess = function(event) {
  database = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

openDB.onerror = function(event) {
  console.log(`Error code ${event.target.errorCode}`);
};

function saveRecord(record) {
  const transaction = database.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore("pending");
  store.add(record);
}

function checkDatabase() {
  const transaction = database.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(() => {
          const transaction = database.transaction(['pending'], 'readwrite');
          const store = transaction.objectStore('pending');
          store.clear();
        });
    }
  };
}

function deletePending() {
  const transaction = database.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.clear();
}
window.addEventListener('online', checkDatabase);
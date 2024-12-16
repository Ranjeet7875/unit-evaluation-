const files = [
    'document1.txt', 'presentation1.pdf', 'song1.mp3', 'installer1.exe', 'archive1.rar', 
    'report1.docx', 'image1.jpg', 'graphic1.png', 'animation1.gif', 'compressed1.zip', 
    'document2.txt', 'presentation2.pdf', 'song2.mp3', 'installer2.exe', 'archive2.rar', 
    'report2.docx', 'image2.jpg', 'graphic2.png', 'animation2.gif', 'compressed2.zip'
];

const fileIcons = {
    '.txt': 'https://via.placeholder.com/50?text=TXT',
    '.pdf': 'https://via.placeholder.com/50?text=PDF',
    '.mp3': 'https://via.placeholder.com/50?text=MP3',
    '.exe': 'https://via.placeholder.com/50?text=EXE',
    '.rar': 'https://via.placeholder.com/50?text=RAR',
    '.docx': 'https://via.placeholder.com/50?text=DOCX',
    '.jpg': 'https://via.placeholder.com/50?text=JPG',
    '.png': 'https://via.placeholder.com/50?text=PNG',
    '.gif': 'https://via.placeholder.com/50?text=GIF',
    '.zip': 'https://via.placeholder.com/50?text=ZIP'
};

let bin = [];

// Categorize files by their extensions
const categorizeFiles = (files) => {
    return files.reduce((folders, file) => {
        const ext = file.split('.').pop();
        if (!folders[ext]) folders[ext] = [];
        folders[ext].push(file);
        return folders;
    }, {});
};

// Render folders
const renderFolders = () => {
    const foldersContainer = document.getElementById('folders-container');
    const folders = categorizeFiles(files);
    foldersContainer.innerHTML = '';

    for (const ext in folders) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderDiv.innerHTML = `<h3>${ext.toUpperCase()}</h3>`;
        folderDiv.onclick = () => displayFiles(ext, folders[ext]);
        foldersContainer.appendChild(folderDiv);
    }
};


const displayFiles = (extension, fileList) => {
    const fileListContainer = document.getElementById('file-list');
    fileListContainer.innerHTML = '';

    if (extension === 'all') {
        fileList = fileList || files;
    }

    fileList.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file';

        const ext = `.${file.split('.').pop()}`;
        const iconUrl = fileIcons[ext] || 'https://via.placeholder.com/50?text=File';

        fileDiv.innerHTML = `
            <img src="${iconUrl}" alt="${ext}" class="fileimg">
            <div class="file-name">${file.replace(ext, '')}</div>
        `;
        fileDiv.onclick = () => moveToBin(file);
        fileListContainer.appendChild(fileDiv);
    });
};


const moveToBin = (file) => {
    bin.push(file);
    files.splice(files.indexOf(file), 1);
    updateBin();
    renderFolders();
    displayFiles('all', files);
};

const updateBin = () => {
    const binFilesContainer = document.getElementById('bin-files');
    binFilesContainer.innerHTML = '';

    bin.forEach((file, index) => {
        const binFileDiv = document.createElement('div');
        binFileDiv.className = 'files';
        binFileDiv.innerHTML = `
        
            <div class="file-names">${file}</div>
            <button class="restore-btn" data-index="${index}">Restore</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        binFilesContainer.appendChild(binFileDiv);
    });

    document.querySelectorAll('.restore-btn').forEach(btn => {
        btn.onclick = () => restoreFile(alert("are you want data restore?",btn.dataset.index));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => deleteFile(alert("are your sure?",btn.dataset.index));
    });
};


const restoreFile = (index) => {
    const restoredFile = bin.splice(index, 1)[0];
    files.push(restoredFile);
    updateBin();
    renderFolders();
};


const deleteFile = (index) => {
    bin.splice(index, 1);
    updateBin();
};

document.getElementById('sort-btn').onclick = () => {
    files.sort();
    renderFolders();
};
document.getElementById('clear-bin').onclick=()=>{
    delete bin
}

document.getElementById('search-bar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredFiles = files.filter(file => file.toLowerCase().includes(query));
    displayFiles('all', filteredFiles);
});

window.onload = () => renderFolders();

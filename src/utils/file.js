// file.js
import SparkMD5 from 'spark-md5';
import service from './request.js';
// 在合适的地方定义上传状态枚举
const UploadStatus = {
    UPLOADING: 1,      // 上传中
    UPLOAD_FINISH: 2,  // 上传完成
    QUICK_UPLOAD: 3    // 秒传
};
/**
 * 将文件字节大小转换为友好格式（B/KB/MB/GB）
 * @param {number} bytes - 文件大小的字节数
 * @param {number} decimals - 保留小数位数，默认2位
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * 计算文件的MD5哈希值（支持大文件分块计算）
 * @param {File} file - 要计算的文件对象
 * @returns {Promise<string>} MD5哈希值的Promise
 */
function calculateFileMD5(file) {
    return new Promise((resolve, reject) => {
        const chunkSize = 2 * 1024 * 1024; // 2MB分块
        const chunks = Math.ceil(file.size / chunkSize);
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        let currentChunk = 0;

        fileReader.onload = function (e) {
            spark.append(e.target.result);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNextChunk();
            } else {
                resolve(spark.end());
            }
        };

        fileReader.onerror = function () {
            reject(new Error('文件读取失败'));
        };

        function loadNextChunk() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            fileReader.readAsArrayBuffer(chunk);
        }

        loadNextChunk();
    });
}

/**
 * 计算文件分片信息
 * @param {File} file - 要分片的文件
 * @param {number} chunkSize - 每个分片的大小（字节），默认5MB
 * @returns {Array} 分片信息数组
 */
function calculateFileChunks(file, chunkSize = 5 * 1024 * 1024) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunks = [];

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        chunks.push({
            index: i + 1, // 从1开始，符合后端接口
            start: start,
            end: end,
            size: chunk.size,
            data: chunk
        });
    }

    return chunks;
}

/**
 * 将文件字节大小转换为KB单位
 * @param {number} bytes - 文件大小的字节数
 * @param {number} decimals - 保留小数位数，默认2位
 * @returns {string} 格式化后的文件大小（KB）
 */
function formatFileSizeToKB(bytes, decimals = 2) {
    if (bytes === 0) return 0;
    return Math.ceil(bytes / 1024);
}


/**
 * 上传单个分片
 * @param {Object} chunk - 分片信息
 * @param {Object} params - 上传参数
 * @returns {Promise} 上传结果的Promise
 */
async function uploadChunk(chunk, params) {
    const {
        filePid,
        totalChunks,
        fileName,
        fileMD5
    } = params;


    const formData = new FormData();
    formData.append('file', chunk.data);
    formData.append('chunkNumber', chunk.index);
    formData.append('chunkTotal', totalChunks);
    formData.append('fileName', fileName);
    formData.append('fileMd5', fileMD5);
    formData.append('userId', JSON.parse(localStorage.getItem("user")).id);
    formData.append('filePid', filePid);
    formData.append("totalSize", formatFileSizeToKB(file.size))

    // 调试：查看FormData内容
    console.log('上传分片参数:', {
        chunkIndex: chunk.index,
        chunkSize: chunk.size,
        fileName: fileName,
        fileMD5: fileMD5,
        userId: JSON.parse(localStorage.getItem("user")).id,
        filePid: filePid,
        totalSize: fileSize
    });

    try {
        // 使用service发送请求
        const response = await service.post('/api/file/upload/one', formData);

        console.log(`分片 ${chunk.index} 上传响应:`, response);
        return response.data || response;
    } catch (error) {
        console.error(`分片 ${chunk.index} 上传失败:`, error);

        // 检查是否有响应数据
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        }

        throw new Error(error.message || `分片 ${chunk.index} 上传失败`);
    }
}

/**
 * 分片上传单个文件
 * @param {File} file - 要上传的文件
 * @param {Object} options - 配置选项
 * @param {number} options.userId - 用户ID
 * @param {string} options.filePid - 父文件夹ID
 * @param {number} options.chunkSize - 分片大小，默认5MB
 * @param {number} options.maxConcurrent - 最大并发数，默认3
 * @param {Function} options.onProgress - 进度回调函数
 * @param {Function} options.onChunkComplete - 分片完成回调函数
 * @returns {Promise} 上传结果的Promise
 */
// file.js


/**
 * 分片上传单个文件
 * @param {File} file - 要上传的文件
 * @param {Object} options - 配置选项
 * @param {number} options.userId - 用户ID
 * @param {string} options.filePid - 父文件夹ID
 * @param {number} options.chunkSize - 分片大小，默认5MB
 * @param {number} options.maxConcurrent - 最大并发数，默认3
 * @param {Function} options.onProgress - 进度回调函数
 * @param {Function} options.onChunkComplete - 分片完成回调函数
 * @returns {Promise} 上传结果的Promise
 */
async function uploadFileInChunks(file, options = {}) {
    const {
        userId,
        filePid = '0',
        chunkSize = 5 * 1024 * 1024,

        onProgress = () => { },
        onChunkComplete = () => { }
    } = options;

    if (!userId) {
        throw new Error('用户ID不能为空');
    }

    if (!file || file.size === 0) {
        throw new Error('文件为空');
    }

    // 添加一个标志，用于停止上传
    let shouldStopUpload = false;

    try {
        // 1. 计算MD5
        onProgress(0, '计算文件MD5...');
        console.log('开始计算文件MD5:', file.name, file.size);

        const fileMD5 = await calculateFileMD5(file);
        console.log('文件MD5计算结果:', fileMD5);

        // 2. 计算分片
        const chunks = calculateFileChunks(file, chunkSize);
        const totalChunks = chunks.length;

        console.log('文件上传准备完成:', {
            fileName: file.name,
            fileSize: file.size,
            totalChunks: totalChunks,
            chunkSize: chunkSize,
            fileMD5: fileMD5,
            userId: userId,
            filePid: filePid
        });

        // 3. 上传所有分片
        const results = [];
        let completedCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            // 检查是否需要停止上传
            if (shouldStopUpload) {
                console.log('检测到秒传，停止后续分片上传');
                break;
            }

            const chunk = chunks[i];
            console.log(`开始上传分片 ${i + 1}/${totalChunks}`);

            const formData = new FormData();
            formData.append('file', chunk.data);
            formData.append('chunkNumber', chunk.index.toString());
            formData.append('chunkTotal', totalChunks.toString());
            formData.append('fileName', file.name);
            formData.append('fileMd5', fileMD5);
            formData.append('userId', userId.toString());
            formData.append('filePid', filePid);
            formData.append("totalSize", file.size)
            try {
                const response = await service.post('/api/file/upload/one', formData, {
                    timeout: 100000 // 设置为5分钟（300秒），根据文件大小调整
                });
                const responseData = response.data || response;

                console.log(`分片 ${chunk.index} 上传响应:`, responseData);

                // 检查是否为秒传（status = 3）
                if (responseData.status === 3 || responseData.status === UploadStatus.UPLOAD_FINISH) {
                    console.log('检测到秒传，停止后续分片上传');
                    shouldStopUpload = true;

                    // 如果秒传成功，立即完成进度
                    onProgress(100, '秒传完成');
                    onChunkComplete(chunk.index, totalChunks, responseData);

                    // 返回秒传结果
                    return {
                        success: true,
                        fileId: responseData.fileId || null,
                        fileName: file.name,
                        fileSize: file.size,
                        fileMD5: fileMD5,
                        isQuickUpload: true, // 标记为秒传
                        data: responseData
                    };
                }

                completedCount++;
                const progress = Math.floor((completedCount / totalChunks) * 100);

                // 更新进度
                onProgress(progress, `上传中: ${chunk.index}/${totalChunks}`);
                onChunkComplete(chunk.index, totalChunks, responseData);

                results.push(responseData);
            } catch (error) {
                console.error(`分片 ${chunk.index} 上传失败:`, error);
                throw error;
            }
        }

        // 4. 处理最终结果
        onProgress(100, '上传完成');

        // 查找成功的文件ID
        let fileId = null;
        for (const result of results) {
            if (result && (result.fileId || (result.data && result.data.fileId))) {
                fileId = result.fileId || result.data.fileId;
                break;
            }
        }

        return {
            success: true,
            fileId: fileId,
            fileName: file.name,
            fileSize: file.size,
            fileMD5: fileMD5,
            isQuickUpload: false, // 普通上传
            data: results[results.length - 1] // 返回最后一个分片的结果
        };

    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
}

// 添加一个工具函数用于获取上传状态
function getUploadStatus() {
    return {
        UPLOADING: 1,
        UPLOAD_FINISH: 2,
        QUICK_UPLOAD: 3
    };
}

/**
 * 批量上传多个文件
 * @param {Array<File>} files - 要上传的文件数组
 * @param {Object} options - 配置选项
 * @returns {Promise} 所有文件上传结果的Promise
 */
async function uploadMultipleFiles(files, options = {}) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileIndex = i + 1;
        const totalFiles = files.length;

        try {
            console.log(`开始上传文件 ${fileIndex}/${totalFiles}: ${file.name}`);

            const result = await uploadFileInChunks(file, {
                ...options,
                onProgress: (progress, message) => {
                    // 计算总体进度
                    const overallProgress = Math.floor(
                        ((fileIndex - 1) / totalFiles) * 100 + (progress / totalFiles)
                    );
                    options.onProgress?.(overallProgress, `(${fileIndex}/${totalFiles}) ${message}`);
                }
            });

            results.push({
                success: true,
                fileName: file.name,
                fileId: result.fileId,
                fileSize: file.size,
                data: result.data
            });

        } catch (error) {
            console.error(`文件 ${file.name} 上传失败:`, error);
            results.push({
                success: false,
                fileName: file.name,
                error: error.message
            });
        }
    }

    return results;
}

export default {
    formatFileSize,
    calculateFileMD5,
    calculateFileChunks,
    uploadChunk,
    uploadFileInChunks,
    uploadMultipleFiles,
    getUploadStatus
};
const BorrowABook = async function (req, res) {
    try {
        
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });

    }
}

const ReturnBorrowedBook = async function (req, res) {
    try {
        
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}
module.exports = { BorrowABook, ReturnBorrowedBook };
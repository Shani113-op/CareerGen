// Cart calculation utilities

export const calculateSemesterTotal = (courseData, branchKey, yearKey, semesterKey) => {
    return courseData.branches[branchKey].years[yearKey].semesters[semesterKey].subjects.reduce(
        (total, subject) => total + subject.price, 0
    );
};

export const calculateYearTotal = (courseData, branchKey, yearKey) => {
    const year = courseData.branches[branchKey].years[yearKey];
    return Object.values(year.semesters).reduce((total, semester) =>
        total + semester.subjects.reduce((semTotal, subject) => semTotal + subject.price, 0), 0
    );
};

export const calculateYearTotalWithDiscount = (courseData, branchKey, yearKey) => {
    const total = calculateYearTotal(courseData, branchKey, yearKey);
    return Math.round(total * 0.85); // 15% discount
};

export const calculateCartTotal = (cart) => {
    return Object.values(cart).reduce((total, item) => total + item.price, 0);
};

export const calculateFinalAmount = (cart, yearlyPurchases, calculateYearTotalWithDiscount, courseData) => {
    let finalCart = {};
    Object.keys(cart).forEach(key => {
        const item = cart[key];
        const yearPackageKey = `${item.university}-${item.branch}-${item.year}`;
        if (!yearlyPurchases[yearPackageKey]) {
            finalCart[key] = item;
        }
    });

    let total = Object.values(finalCart).reduce((acc, item) => acc + item.price, 0);
    
    Object.keys(yearlyPurchases).forEach(yearKey => {
        if (yearlyPurchases[yearKey]) {
            const [branch, year] = yearKey.split('-');
            // Find the courseData for this university
            const universityData = Object.values(courseData).find(data => 
                Object.keys(data.branches).includes(branch)
            );
            if (universityData) {
                total += calculateYearTotalWithDiscount(universityData, branch, year);
            }
        }
    });
    return total;
};
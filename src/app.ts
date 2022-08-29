interface RowData {
  id: string;
  row: number;
  age: number;
  gender: string;
}

export const getData = async (pageNumber: number = 1) => {
  let apiKey: string = `LEIX-GF3O-AG7I-6J84`;
  let baseUrl: string = `https://randomapi.com/api/8csrgnjw?key=${apiKey}&page=${pageNumber}`;
  let tableData: Array<RowData> = [];

  try {
    let response = await fetch(baseUrl);
    let data = await response.json();
    tableData = data.results[0];
    let navigation = data.results[0]?.paging;
    return { tableData, navigation };
  } catch (error) {
    console.log(error);
  }
};

const startApp = async () => {
  let page = 1;
  let tbody: any = document.getElementsByTagName("tbody");
  let label: any = document.getElementsByTagName("label");
  let nextButton: any = await document.querySelector("[data-nextbtn='next']");
  let prevButton: any = await document.querySelector("[data-prevbtn='prev']");
  let newData: Array<RowData>;
  let pagination;

  const disable = () => {
    if (pagination && page > 1) {
      if (page === 1) {
        prevButton.disabled = true;
      } else {
        prevButton.disabled = false;
      }
    } else {
      prevButton.disabled = true;
    }
  };

  const renderTableFromApi = async (pageNumber: number) => {
    let res: any = await getData(pageNumber);
    pagination = res.navigation;

    newData = res?.tableData[page]
      .map((item: RowData) => {
        return `
                <tr data-entryid=${item.id} >
                        <td>${item.row}</td>
                        <td>${item.gender}</td>
                        <td>${item.age}</td>
                    </tr>
                `;
      })
      .join("");

    disable();
    tbody[0].innerHTML = newData;
    label[0].innerHTML = `Page ${page}`;
  };

  nextButton?.addEventListener("click", function () {
    page = page + 1;
    renderPage(page);
  });

  prevButton?.addEventListener("click", function () {
    page = page - 1;
    renderTableFromApi(page);
  });

  const renderPage = (pageNumber: number) => {
    renderTableFromApi(pageNumber);
  };

  renderPage(page);
};

document.addEventListener("DOMContentLoaded", startApp);

<template>
    <div class="dash-board">
      <div class="div">
        <div class="overlap">
          <div class="overlap-group">
            <div class="overlap-2">
              <div class="view" />
              <div class="view-2" />
              <div class="view-3" />
              <div class="div-wrapper">
                <p class="text-wrapper">금일 소속팀 각 팀원 진척도</p>
              </div>
              <div class="overlap-wrapper">
                <div class="overlap-3">
                  <div class="text-wrapper-2">팀 리스트</div>
                </div>
              </div>
              <div class="view-wrapper">
                <div class="overlap-group-wrapper">
                  <div class="overlap-group-2">
                    <div class="view-4" />
                    <div class="view-5" />
                  </div>
                </div>
              </div>
              <div class="view-6">
                <div class="view-7">
                  <div class="overlap-group-3">
                    <div class="text-wrapper-3">팀 이름</div>
                    <div class="pngwing-com-wrapper">
                      <img
                        class="pngwing-com"
                        alt="Pngwing com"
                        :src="pngwingCom41"
                      />
                    </div>
                    <div class="img-wrapper">
                      <img
                        class="img"
                        alt="Pngwing com"
                        :src="pngwingCom31"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="view-8">
                <div class="view-9">
                  <div class="view-10">
                    <div class="view-11">
                      <div class="overlap-group-4">
                        <div class="text-wrapper-4">팀원</div>
                        <div class="text-wrapper-5">진척도 000%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="overlap-4">
              <div class="view-12" />
              <div class="view-13" />
              <div class="view-14">
                <div class="overlap-5">
                  <div class="text-wrapper-6">작업 생성</div>
                </div>
              </div>
              <div class="view-15">
                <div class="overlap-6">
                  <div class="text-wrapper-7">팀 전체 상세보기</div>
                </div>
              </div>
              <div class="view-12">
                <div class="view-16">
                  <div class="overlap-group-5">
                    <div class="text-wrapper-6">작업 생성</div>
                  </div>
                </div>
                <div class="view-17">
                  <div class="overlap-7">
                    <div class="text-wrapper-8">생성</div>
                  </div>
                </div>
                <div class="view-18" />
                <div class="view-19" />
                <div class="view-20" />
                <div class="view-21" />
                <div class="view-22" />
              </div>
              <div class="view-23">
                <div class="overlap-8">
                  <div class="text-wrapper-9">팀 작업 상세보기</div>
                </div>
              </div>
              <div class="view-24">
                <div class="overlap-8">
                  <div class="text-wrapper-10">워크스페이스 상세보기</div>
                </div>
              </div>
            </div>
          </div>
          <div class="overlap-9">
            <div class="view-25" />
            <div class="view-26">
              <div class="overlap-6">
                <div class="text-wrapper-7">소속 팀 내 할일</div>
              </div>
            </div>
            <div class="view-27">
              <div class="view-28">
                <div class="view-29">
                  <div class="view-30">
                    <div class="view-31">
                      <div class="overlap-group-6">
                        <div class="text-wrapper-11">작업내용</div>
                        <div class="text-wrapper-12">yyyy-mm-dd (O) hh-mm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="view-32">
          <div class="view-33">
            <div class="overlap-group-7">
              <div class="text-wrapper-13">유저명</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "DashBoard",
    data() {
      return {
        pngwingCom31: require('@/assets/pencil.png'),
        pngwingCom41: require('@/assets/trashcan.png'),
      };
    },
  };
  </script>
  
  <style>
  .dash-board {
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
  
  .dash-board .div {
    background-color: #ffffff;
    border: 1px solid;
    border-color: #000000;
    height: 1024px;
    overflow: hidden;
    position: relative;
    width: 1440px;
  }
  
  .dash-board .overlap {
    height: 960px;
    left: 0;
    position: absolute;
    top: 65px;
    width: 1442px;
  }
  
  .dash-board .overlap-group {
    height: 960px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1442px;
  }
  
  .dash-board .overlap-2 {
    height: 959px;
    left: 0;
    position: absolute;
    top: 0;
    width: 952px;
  }
  
  .dash-board .view {
    border: 1px solid;
    border-color: #000000;
    height: 959px;
    left: 0;
    position: absolute;
    top: 0;
    width: 342px;
  }
  
  .dash-board .view-2 {
    border: 1px solid;
    border-color: #000000;
    height: 480px;
    left: 342px;
    position: absolute;
    top: 0;
    width: 610px;
  }
  
  .dash-board .view-3 {
    background-color: #bdb9b9;
    border: 1px solid;
    border-color: #000000;
    height: 47px;
    left: 342px;
    position: absolute;
    top: 1px;
    width: 610px;
  }
  
  .dash-board .div-wrapper {
    height: 36px;
    left: 478px;
    position: absolute;
    top: 6px;
    width: 340px;
  }
  
  .dash-board .text-wrapper {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 0;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 0;
    white-space: nowrap;
  }
  
  .dash-board .overlap-wrapper {
    height: 48px;
    left: 0;
    position: absolute;
    top: 0;
    width: 344px;
  }
  
  .dash-board .overlap-3 {
    background-color: #bdb9b9;
    border: 1px solid;
    border-color: #000000;
    height: 48px;
    position: relative;
    width: 342px;
  }
  
  .dash-board .text-wrapper-2 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 37px;
    left: 93px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 4px;
    width: 154px;
  }
  
  .dash-board .view-wrapper {
    border: 1px solid;
    border-color: #000000;
    height: 48px;
    left: 294px;
    position: absolute;
    top: 0;
    width: 48px;
  }
  
  .dash-board .overlap-group-wrapper {
    height: 20px;
    left: 13px;
    position: relative;
    top: 13px;
    width: 20px;
  }
  
  .dash-board .overlap-group-2 {
    height: 20px;
    position: relative;
  }
  
  .dash-board .view-4 {
    background-color: #000000;
    height: 20px;
    left: 7px;
    position: absolute;
    top: 0;
    width: 6px;
  }
  
  .dash-board .view-5 {
    background-color: #000000;
    height: 20px;
    left: 7px;
    position: absolute;
    top: 0;
    transform: rotate(-90.00deg);
    width: 6px;
  }
  
  .dash-board .view-6 {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    left: 9px;
    position: absolute;
    top: 58px;
    width: 324px;
  }
  
  .dash-board .view-7 {
    height: 56px;
    margin-right: -2.00px;
    position: relative;
    width: 326px;
  }
  
  .dash-board .overlap-group-3 {
    border: 1px solid;
    border-color: #000000;
    height: 56px;
    position: relative;
    width: 324px;
  }
  
  .dash-board .text-wrapper-3 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 10px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 9px;
    white-space: nowrap;
  }
  
  .dash-board .pngwing-com-wrapper {
    border: 1px solid;
    border-color: #000000;
    height: 56px;
    left: 211px;
    position: absolute;
    top: -1px;
    width: 56px;
  }
  
  .dash-board .pngwing-com {
    height: 52px;
    left: 1px;
    object-fit: cover;
    position: absolute;
    top: 1px;
    width: 52px;
  }
  
  .dash-board .img-wrapper {
    border: 1px solid;
    border-color: #000000;
    height: 56px;
    left: 267px;
    position: absolute;
    top: -1px;
    width: 56px;
  }
  
  .dash-board .img {
    height: 53px;
    left: 1px;
    object-fit: cover;
    position: absolute;
    top: 1px;
    width: 53px;
  }
  
  .dash-board .view-8 {
    height: 122px;
    left: 355px;
    position: absolute;
    top: 58px;
    width: 584px;
  }
  
  .dash-board .view-9 {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    width: 584px;
  }
  
  .dash-board .view-10 {
    height: 56px;
    position: relative;
    width: 584px;
  }
  
  .dash-board .view-11 {
    height: 56px;
    width: 588px;
  }
  
  .dash-board .overlap-group-4 {
    border: 1px solid;
    border-color: #000000;
    height: 56px;
    position: relative;
    width: 584px;
  }
  
  .dash-board .text-wrapper-4 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 10px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 9px;
    width: 166px;
  }
  
  .dash-board .text-wrapper-5 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 390px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 9px;
    white-space: nowrap;
  }
  
  .dash-board .overlap-4 {
    height: 480px;
    left: 342px;
    position: absolute;
    top: 480px;
    width: 1100px;
  }
  
  .dash-board .view-12 {
    border: 1px solid;
    border-color: #000000;
    height: 480px;
    left: 0;
    position: absolute;
    top: 0;
    width: 610px;
  }
  
  .dash-board .view-13 {
    border: 1px solid;
    border-color: #000000;
    height: 480px;
    left: 610px;
    position: absolute;
    top: 0;
    width: 488px;
  }
  
  .dash-board .view-14 {
    height: 47px;
    left: 0;
    position: absolute;
    top: 0;
    width: 612px;
  }
  
  .dash-board .overlap-5 {
    border: 1px solid;
    border-color: #000000;
    height: 47px;
    position: relative;
    width: 610px;
  }
  
  .dash-board .text-wrapper-6 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 245px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 4px;
    white-space: nowrap;
  }
  
  .dash-board .view-15 {
    height: 47px;
    left: 610px;
    position: absolute;
    top: 0;
    width: 490px;
  }
  
  .dash-board .overlap-6 {
    background-color: #bdb9b9;
    border: 1px solid;
    border-color: #000000;
    height: 47px;
    position: relative;
    width: 488px;
  }
  
  .dash-board .text-wrapper-7 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 133px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 4px;
    white-space: nowrap;
    width: 219px;
  }
  
  .dash-board .view-16 {
    height: 47px;
    left: -1px;
    position: absolute;
    top: -1px;
    width: 612px;
  }
  
  .dash-board .overlap-group-5 {
    background-color: #bdb9b9;
    border: 1px solid;
    border-color: #000000;
    height: 47px;
    position: relative;
    width: 610px;
  }
  
  .dash-board .view-17 {
    height: 53px;
    left: 6px;
    position: absolute;
    top: 417px;
    width: 597px;
  }
  
  .dash-board .overlap-7 {
    border: 1px solid;
    border-color: #000000;
    height: 53px;
    position: relative;
    width: 595px;
  }
  
  .dash-board .text-wrapper-8 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 32px;
    left: 163px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 10px;
    white-space: nowrap;
    width: 267px;
  }
  
  .dash-board .view-18 {
    border: 1px solid;
    border-color: #000000;
    height: 46px;
    left: 6px;
    position: absolute;
    top: 55px;
    width: 481px;
  }
  
  .dash-board .view-19 {
    border: 1px solid;
    border-color: #000000;
    height: 70px;
    left: 6px;
    position: absolute;
    top: 339px;
    width: 295px;
  }
  
  .dash-board .view-20 {
    border: 1px solid;
    border-color: #000000;
    height: 70px;
    left: 306px;
    position: absolute;
    top: 339px;
    width: 295px;
  }
  
  .dash-board .view-21 {
    border: 1px solid;
    border-color: #000000;
    height: 46px;
    left: 494px;
    position: absolute;
    top: 55px;
    width: 107px;
  }
  
  .dash-board .view-22 {
    border: 1px solid;
    border-color: #000000;
    height: 226px;
    left: 6px;
    position: absolute;
    top: 107px;
    width: 595px;
  }
  
  .dash-board .view-23 {
    height: 60px;
    left: 619px;
    position: absolute;
    top: 58px;
    width: 473px;
  }
  
  .dash-board .overlap-8 {
    border: 1px solid;
    border-color: #000000;
    height: 60px;
    position: relative;
    width: 471px;
  }
  
  .dash-board .text-wrapper-9 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 129px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 11px;
    white-space: nowrap;
  }
  
  .dash-board .view-24 {
    height: 60px;
    left: 619px;
    position: absolute;
    top: 129px;
    width: 473px;
  }
  
  .dash-board .text-wrapper-10 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 92px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 11px;
    white-space: nowrap;
  }
  
  .dash-board .overlap-9 {
    height: 480px;
    left: 952px;
    position: absolute;
    top: 0;
    width: 490px;
  }
  
  .dash-board .view-25 {
    border: 1px solid;
    border-color: #000000;
    height: 480px;
    left: 0;
    position: absolute;
    top: 0;
    width: 488px;
  }
  
  .dash-board .view-26 {
    height: 47px;
    left: 0;
    position: absolute;
    top: 1px;
    width: 490px;
  }
  
  .dash-board .view-27 {
    height: 61px;
    left: 9px;
    position: absolute;
    top: 58px;
    width: 471px;
  }
  
  .dash-board .view-28 {
    height: 130px;
    width: 584px;
  }
  
  .dash-board .view-29 {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    width: 471px;
  }
  
  .dash-board .view-30 {
    height: 61px;
    position: relative;
    width: 471px;
  }
  
  .dash-board .view-31 {
    height: 61px;
    width: 475px;
  }
  
  .dash-board .overlap-group-6 {
    border: 1px solid;
    border-color: #000000;
    height: 61px;
    position: relative;
    width: 471px;
  }
  
  .dash-board .text-wrapper-11 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 39px;
    left: 8px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 10px;
    width: 134px;
  }
  
  .dash-board .text-wrapper-12 {
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 20px;
    font-weight: 400;
    height: 39px;
    left: 222px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 10px;
    width: 235px;
  }
  
  .dash-board .view-32 {
    border: 1px solid;
    border-color: #000000;
    height: 65px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1440px;
  }
  
  .dash-board .view-33 {
    height: 42px;
    left: 1299px;
    position: relative;
    top: 10px;
    width: 128px;
  }
  
  .dash-board .overlap-group-7 {
    border: 1px solid;
    border-color: #000000;
    height: 42px;
    position: relative;
    width: 126px;
  }
  
  .dash-board .text-wrapper-13 {
    -webkit-text-stroke: 1px #000000;
    color: #000000;
    font-family: "Inter-Regular", Helvetica;
    font-size: 30px;
    font-weight: 400;
    height: 36px;
    left: 19px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 1px;
    white-space: nowrap;
  }
  </style>